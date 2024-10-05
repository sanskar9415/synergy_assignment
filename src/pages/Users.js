import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Table, TableHead, TableBody, TableCell, TableRow, Button, Drawer, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField
} from '@mui/material';
import UserForm from './userForm';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(API_URL);
        setUsers(response.data);
      } catch (error) {
        alert('Error fetching users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleCreate = async (newUser) => {
    try {
      const response = await axios.post(API_URL, newUser);
      setUsers([...users, response.data]);
      setOpen(false);
    } catch (error) {
      alert('Error creating user');
    }
  };

  const handleUpdate = async (updatedUser) => {
    try {
      const response = await axios.put(`${API_URL}/${updatedUser.id}`, updatedUser);
      setUsers(users.map(user => (user.id === updatedUser.id ? response.data : user)));
      setSelectedUser(null);
    } catch (error) {
      alert('Error updating user');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter(user => user.id !== id));
      setDeleteConfirmOpen(false);
    } catch (error) {
      alert('Error deleting user');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>User Management</h1>
      <Button onClick={() => setOpen(true)}>Add User</Button>
      <TextField
        label="Search by name"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginLeft: '1rem' }}
      />
      {loading ? <p>Loading...</p> : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={user.id} style={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white' }}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Button onClick={() => setSelectedUser(user)}>Edit</Button>
                  <Button onClick={() => {
                    setUserToDelete(user);
                    setDeleteConfirmOpen(true);
                  }}>Delete</Button>
                  <Link to={`/user/${user.id}`}>Details</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <UserForm onSubmit={handleCreate} />
      </Drawer>

      {selectedUser && (
        <Drawer anchor="right" open={Boolean(selectedUser)} onClose={() => setSelectedUser(null)}>
          <UserForm user={selectedUser} onSubmit={handleUpdate} />
        </Drawer>
      )}

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {userToDelete?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={() => handleDelete(userToDelete.id)} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;