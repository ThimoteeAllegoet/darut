'use client';

import { useState, useEffect } from 'react';
import { LeaveRequest, TeamMember, LeaveType, PeriodType, LeaveStatus } from '../types/leaves';

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
    comment?: string
  ) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    const status: LeaveStatus = type === 'Congés' ? 'pending' : 'approved';

    const newLeave: LeaveRequest = {
      id: Date.now().toString(),
      memberId,
      memberName: member.name,
      type,
      date,
      period,
      status,
      comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveLeaves([...leaves, newLeave]);
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

  const approveLeave = (id: string, validatorComment?: string) => {
    updateLeave(id, { status: 'approved', validatorComment });
  };

  const rejectLeave = (id: string, validatorComment?: string) => {
    updateLeave(id, { status: 'rejected', validatorComment });
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
    return leaves.filter((leave) => leave.date === date && leave.status === 'approved');
  };

  const getLeavesByMember = (memberId: string) => {
    return leaves.filter((leave) => leave.memberId === memberId);
  };

  const getPendingLeaves = () => {
    return leaves.filter((leave) => leave.status === 'pending');
  };

  return {
    leaves,
    members,
    addLeave,
    updateLeave,
    deleteLeave,
    approveLeave,
    rejectLeave,
    addMember,
    updateMember,
    deleteMember,
    getLeavesByDate,
    getLeavesByMember,
    getPendingLeaves,
  };
}
