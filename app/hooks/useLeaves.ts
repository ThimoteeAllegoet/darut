'use client';

import { useState, useEffect } from 'react';
import { LeaveRequest, TeamMember, LeaveType, PeriodType, LeaveStatus } from '../types/leaves';
import { RecurrenceConfig } from '../types/recurrence';
import { generateRecurrentDates } from '../utils/recurrence';

const LEAVES_STORAGE_KEY = 'darut_leaves';
const MEMBERS_STORAGE_KEY = 'darut_team_members';

export function useLeaves() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const storedLeaves = localStorage.getItem(LEAVES_STORAGE_KEY);
    const storedMembers = localStorage.getItem(MEMBERS_STORAGE_KEY);

    if (storedLeaves) {
      try {
        setLeaves(JSON.parse(storedLeaves));
      } catch (error) {
        console.error('Error loading leaves:', error);
      }
    }

    if (storedMembers) {
      try {
        setMembers(JSON.parse(storedMembers));
      } catch (error) {
        console.error('Error loading team members:', error);
      }
    }
  }, []);

  const saveLeaves = (newLeaves: LeaveRequest[]) => {
    setLeaves(newLeaves);
    localStorage.setItem(LEAVES_STORAGE_KEY, JSON.stringify(newLeaves));
  };

  const saveMembers = (newMembers: TeamMember[]) => {
    setMembers(newMembers);
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(newMembers));
  };

  const addLeave = (
    memberId: string,
    type: LeaveType,
    date: string,
    period: PeriodType,
    comment?: string,
    recurrence?: RecurrenceConfig
  ) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    const status: LeaveStatus = type === 'Congés' ? 'pending' : 'approved';

    // Si récurrence, créer plusieurs instances
    if (recurrence && recurrence.type !== 'none') {
      const recurrenceGroupId = `recur-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      // Exclure weekends et jours fériés sauf pour les astreintes
      const shouldExclude = type !== 'Astreinte';
      const dates = generateRecurrentDates(date, recurrence, 24, shouldExclude, shouldExclude);

      const newLeaves: LeaveRequest[] = dates.map((recurrentDate, index) => ({
        id: `${Date.now() + index}-${Math.random().toString(36).substr(2, 9)}`,
        memberId,
        memberName: member.name,
        type,
        date: recurrentDate,
        period,
        status,
        comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recurrence,
        recurrenceGroupId,
      }));

      saveLeaves([...leaves, ...newLeaves]);
    } else {
      // Pas de récurrence, créer une seule instance
      const newLeave: LeaveRequest = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        memberId,
        memberName: member.name,
        type,
        date,
        period,
        status,
        comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recurrence,
      };

      saveLeaves([...leaves, newLeave]);
    }
  };

  const addMultipleLeaves = (
    memberId: string,
    type: LeaveType,
    dates: string[],
    period: PeriodType,
    comment?: string
  ) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    const status: LeaveStatus = type === 'Congés' ? 'pending' : 'approved';

    const newLeaves: LeaveRequest[] = dates.map((date, index) => ({
      id: `${Date.now() + index}-${Math.random().toString(36).substr(2, 9)}`,
      memberId,
      memberName: member.name,
      type,
      date,
      period,
      status,
      comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    saveLeaves([...leaves, ...newLeaves]);
  };

  const updateLeave = (id: string, updates: Partial<Omit<LeaveRequest, 'id' | 'createdAt'>>) => {
    const updated = leaves.map((leave) =>
      leave.id === id
        ? { ...leave, ...updates, updatedAt: new Date().toISOString() }
        : leave
    );
    saveLeaves(updated);
  };

  const deleteLeave = (id: string) => {
    saveLeaves(leaves.filter((leave) => leave.id !== id));
  };

  const deleteLeaveOccurrence = (id: string) => {
    // Supprime uniquement cette occurrence
    saveLeaves(leaves.filter((leave) => leave.id !== id));
  };

  const deleteLeaveSeries = (recurrenceGroupId: string) => {
    // Supprime toutes les occurrences de la série
    saveLeaves(leaves.filter((leave) => leave.recurrenceGroupId !== recurrenceGroupId));
  };

  const approveLeave = (id: string, validatorComment?: string) => {
    updateLeave(id, { status: 'approved', validatorComment });
  };

  const rejectLeave = (id: string, validatorComment?: string) => {
    updateLeave(id, { status: 'rejected', validatorComment });
  };

  const approveLeaves = (ids: string[], validatorComment?: string) => {
    const updated = leaves.map((leave) =>
      ids.includes(leave.id)
        ? { ...leave, status: 'approved' as LeaveStatus, validatorComment, updatedAt: new Date().toISOString() }
        : leave
    );
    saveLeaves(updated);
  };

  const rejectLeaves = (ids: string[], validatorComment?: string) => {
    const updated = leaves.map((leave) =>
      ids.includes(leave.id)
        ? { ...leave, status: 'rejected' as LeaveStatus, validatorComment, updatedAt: new Date().toISOString() }
        : leave
    );
    saveLeaves(updated);
  };

  const deleteLeaves = (ids: string[]) => {
    saveLeaves(leaves.filter((leave) => !ids.includes(leave.id)));
  };

  const addMember = (memberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      ...memberData,
    };
    saveMembers([...members, newMember]);
  };

  const updateMember = (id: string, updates: Partial<Omit<TeamMember, 'id'>>) => {
    const updated = members.map((member) =>
      member.id === id ? { ...member, ...updates } : member
    );
    saveMembers(updated);
  };

  const deleteMember = (id: string) => {
    saveMembers(members.filter((member) => member.id !== id));
    // Supprimer aussi les congés du membre
    saveLeaves(leaves.filter((leave) => leave.memberId !== id));
  };

  const getLeavesByDate = (date: string) => {
    return leaves.filter((leave) => leave.date === date && leave.status !== 'rejected');
  };

  const getLeavesByMember = (memberId: string) => {
    return leaves.filter((leave) => leave.memberId === memberId);
  };

  const getPendingLeaves = () => {
    return leaves.filter((leave) => leave.status === 'pending' || leave.status === 'deletion_pending');
  };

  const requestDeletion = (id: string) => {
    const leave = leaves.find((l) => l.id === id);
    if (!leave) return;

    // If leave is type 'Congés' and status is 'approved', mark as deletion_pending
    if (leave.type === 'Congés' && leave.status === 'approved') {
      updateLeave(id, { status: 'deletion_pending' });
    } else {
      // For other types or non-approved leaves, delete immediately
      deleteLeave(id);
    }
  };

  const approveDeletion = (id: string) => {
    deleteLeave(id);
  };

  const rejectDeletion = (id: string) => {
    updateLeave(id, { status: 'approved' });
  };

  const approveDeletions = (ids: string[]) => {
    saveLeaves(leaves.filter((leave) => !ids.includes(leave.id)));
  };

  const rejectDeletions = (ids: string[]) => {
    const updated = leaves.map((leave) =>
      ids.includes(leave.id)
        ? { ...leave, status: 'approved' as LeaveStatus, updatedAt: new Date().toISOString() }
        : leave
    );
    saveLeaves(updated);
  };

  return {
    leaves,
    members,
    addLeave,
    addMultipleLeaves,
    updateLeave,
    deleteLeave,
    deleteLeaveOccurrence,
    deleteLeaveSeries,
    approveLeave,
    rejectLeave,
    approveLeaves,
    rejectLeaves,
    deleteLeaves,
    requestDeletion,
    approveDeletion,
    rejectDeletion,
    approveDeletions,
    rejectDeletions,
    addMember,
    updateMember,
    deleteMember,
    getLeavesByDate,
    getLeavesByMember,
    getPendingLeaves,
  };
}
