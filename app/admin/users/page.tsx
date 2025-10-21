'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/Button'
import Link from 'next/link'

export default function UserManagementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingUser, setEditingUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }

    if (status === 'authenticated') {
      const userRole = (session?.user as any)?.role
      if (userRole !== 'ADMIN') {
        router.push('/admin')
      }
    }
  }, [status, session, router])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users')
        if (response.ok) {
          const data = await response.json()
          setUsers(data)
        } else {
          setError('Failed to load users')
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        setError('Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchUsers()
    }
  }, [status])

  const updateUser = async (userId: string, updates: any) => {
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const updated = await response.json()
        setUsers(users.map(u => u.id === userId ? updated : u))
        setSuccess('User updated successfully')
        setEditingUser(null)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update user')
      }
    } catch (err) {
      setError('Failed to update user')
    }
  }

  const getRoleColor = (role: string) => {
    const colors: any = {
      CLIENT: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      STAFF: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
      ADMIN: 'bg-red-500/20 text-red-300 border border-red-500/30',
    }
    return colors[role] || colors.CLIENT
  }

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen stars-bg">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded w-1/4"></div>
            <div className="h-96 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen stars-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
            ← Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-white/70 mt-2">
            Manage user accounts and permissions
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card-dark rounded-xl p-4">
            <p className="text-white/70 text-sm">Total Users</p>
            <p className="text-3xl font-bold text-white">{users.length}</p>
          </div>
          <div className="card-dark rounded-xl p-4">
            <p className="text-white/70 text-sm">Clients</p>
            <p className="text-3xl font-bold text-blue-400">{users.filter(u => u.role === 'CLIENT').length}</p>
          </div>
          <div className="card-dark rounded-xl p-4">
            <p className="text-white/70 text-sm">Staff</p>
            <p className="text-3xl font-bold text-purple-400">{users.filter(u => u.role === 'STAFF').length}</p>
          </div>
          <div className="card-dark rounded-xl p-4">
            <p className="text-white/70 text-sm">Admins</p>
            <p className="text-3xl font-bold text-red-400">{users.filter(u => u.role === 'ADMIN').length}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="card-dark rounded-2xl p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-white/70">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{user.name || 'N/A'}</div>
                        <div className="text-sm text-white/70">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingUser?.id === user.id ? (
                          <select
                            value={editingUser.role}
                            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                            className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                          >
                            <option value="CLIENT">Client</option>
                            <option value="STAFF">Staff</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {user.isLocked && (
                            <span className="text-xs text-red-400">🔒 Locked</span>
                          )}
                          {user.isDisabled && (
                            <span className="text-xs text-red-400">⛔ Disabled</span>
                          )}
                          {!user.isLocked && !user.isDisabled && (
                            <span className="text-xs text-green-400">✓ Active</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {editingUser?.id === user.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateUser(user.id, { role: editingUser.role })}
                              className="text-green-400 hover:text-green-300 font-medium"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="text-white/70 hover:text-white font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingUser(user)}
                              className="text-purple-400 hover:text-purple-300 font-medium"
                            >
                              Edit Role
                            </button>
                            {user.isLocked && (
                              <button
                                onClick={() => updateUser(user.id, { isLocked: false, failedLoginAttempts: 0 })}
                                className="text-blue-400 hover:text-blue-300 font-medium"
                              >
                                Unlock
                              </button>
                            )}
                            {!user.isDisabled ? (
                              <button
                                onClick={() => {
                                  if (confirm('Disable this user account?')) {
                                    updateUser(user.id, { isDisabled: true })
                                  }
                                }}
                                className="text-red-400 hover:text-red-300 font-medium"
                              >
                                Disable
                              </button>
                            ) : (
                              <button
                                onClick={() => updateUser(user.id, { isDisabled: false })}
                                className="text-green-400 hover:text-green-300 font-medium"
                              >
                                Enable
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
