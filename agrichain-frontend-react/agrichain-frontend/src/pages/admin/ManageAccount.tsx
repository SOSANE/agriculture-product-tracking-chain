import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Search, ChevronDown, ChevronUp, MoveLeft, MoveRight } from 'lucide-react';
import {User} from "../../types";

const ManageAccount: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'ascending' | 'descending' } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [usersLoading, setUsersLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);

    const handleDelete = (username: string) => {
        setUsers(users.filter(user => user.username !== username));
        setDeleteConfirm(null);
    };

    const handleSort = (key: keyof User) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = React.useMemo(() => {
        if (!sortConfig) return users;

        return [...users].sort((a, b) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }, [users, sortConfig]);

    const filteredUsers = sortedUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'farmer':
                return 'bg-primary-light';
            case 'processor':
                return 'bg-secondary-light';
            case 'distributor':
                return 'bg-accent-light';
            case 'retailer':
                return 'bg-warning';
            case 'regulator':
                return 'bg-error';
            case 'admin':
                return 'bg-neutral-700';
            default:
                return 'bg-neutral-400';
        }
    };

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setUsersLoading(true);
                const response = await fetch(`/api/users`, {
                    credentials: 'include'
                });

                if (!response.ok) throw new Error('Failed to fetch users');

                const data = await response.json();
                setUsers(data);
            } catch (err) {
                console.error('Error fetching users:', err);
            } finally {
                setUsersLoading(false);
            }
        };

        loadUsers();
    }, []);

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Manage Accounts</h1>
                <p className="text-neutral-600 mt-2">View and manage all user accounts in the system</p>
            </div>

            <div className="card">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-neutral-400" />
                        </div>
                        <input
                            type="text"
                            className="input pl-10"
                            placeholder="Search accounts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Link
                        to="/add-account"
                        className="btn btn-primary inline-flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                        <Plus className="h-5 w-5" />
                        Add Account
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    {usersLoading ? (
                            <div className="flex justify-center py-8">
                                <span className="loading loading-spinner text-primary"></span>
                            </div>
                        ) : (
                    <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('username')}
                            >
                                <div className="flex items-center gap-1">
                                    Username
                                    {sortConfig?.key === 'username' && (
                                        sortConfig.direction === 'ascending' ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('name')}
                            >
                                <div className="flex items-center gap-1">
                                    Name
                                    {sortConfig?.key === 'name' && (
                                        sortConfig.direction === 'ascending' ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('email')}
                            >
                                <div className="flex items-center gap-1">
                                    Email
                                    {sortConfig?.key === 'email' && (
                                        sortConfig.direction === 'ascending' ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('organization')}
                            >
                                <div className="flex items-center gap-1">
                                    Organization
                                    {sortConfig?.key === 'organization' && (
                                        sortConfig.direction === 'ascending' ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('role')}
                            >
                                <div className="flex items-center gap-1">
                                    Role
                                    {sortConfig?.key === 'role' && (
                                        sortConfig.direction === 'ascending' ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )
                                    )}
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.username} className="hover:bg-neutral-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-neutral-900">{user.username}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-sm font-medium ${user.name}`}>
                                            {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-neutral-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                        {user.organization}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getRoleBadgeClass(user.role)}`}>
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end items-center gap-2">
                                            <Link
                                                to={`/edit-account/${user.username}`}
                                                className="text-primary hover:text-primary-dark"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </Link>
                                            {deleteConfirm === user.username ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleDelete(user.username)}
                                                        className="text-error hover:text-error-dark"
                                                    >
                                                        <span className="text-xs font-medium">Confirm</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="text-neutral-500 hover:text-neutral-700"
                                                    >
                                                        <span className="text-xs font-medium">Cancel</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteConfirm(user.username)}
                                                    className="text-error hover:text-error-dark"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-neutral-500">
                                    No accounts found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                        )}
                </div>

                {filteredUsers.length > 0 && (
                    <div className="px-6 py-3 flex items-center justify-between border-t border-neutral-200">
                        <div className="text-sm text-neutral-500">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
                            <span className="font-medium">{filteredUsers.length}</span> accounts
                        </div>
                        <div className="flex gap-2">
                            <Link
                                to=""
                                className="btn btn-outline px-3 py-1 text-sm"
                            >
                                <MoveLeft className="h-5 w-5" />
                                Previous
                            </Link>
                            <Link
                                to=""
                                className="btn btn-outline px-3 py-1 text-sm"
                            >
                                <MoveRight className="h-5 w-5" />
                                Next
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageAccount;