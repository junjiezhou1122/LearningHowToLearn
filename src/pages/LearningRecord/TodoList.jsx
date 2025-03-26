import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Fade,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from '@mui/icons-material';
import { addTodo, updateTodo, deleteTodo, toggleTodoStatus } from '../../store/slices/learningRecordSlice';

const TodoList = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.learningRecord.todos);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: null,
  });

  const handleClickOpen = () => {
    setOpen(true);
    setEditMode(false);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: null,
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTodo(null);
  };

  const handleEditTodo = (todo) => {
    setSelectedTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      dueDate: new Date(todo.dueDate),
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (editMode && selectedTodo) {
      dispatch(updateTodo({
        id: selectedTodo.id,
        updates: formData,
      }));
    } else {
      dispatch(addTodo(formData));
    }
    handleClose();
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'error',
      medium: 'warning',
      low: 'success',
    };
    return colors[priority] || 'default';
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Todo List
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          sx={{ borderRadius: 2 }}
        >
          Add Todo
        </Button>
      </Stack>

      <List>
        {todos.map((todo) => (
          <Fade in key={todo.id}>
            <Paper
              elevation={2}
              sx={{
                mb: 2,
                borderRadius: 2,
                borderLeft: 6,
                borderColor: `${getPriorityColor(todo.priority)}.main`,
                opacity: todo.completed ? 0.7 : 1,
              }}
            >
              <ListItem
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                <IconButton
                  edge="start"
                  onClick={() => dispatch(toggleTodoStatus(todo.id))}
                  sx={{ mr: 2 }}
                >
                  {todo.completed ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <UncheckedIcon />
                  )}
                </IconButton>
                <ListItemText
                  primary={
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration: todo.completed ? 'line-through' : 'none',
                      }}
                    >
                      {todo.title}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {todo.description}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={todo.priority.toUpperCase()}
                          size="small"
                          color={getPriorityColor(todo.priority)}
                        />
                        {todo.dueDate && (
                          <Chip
                            label={new Date(todo.dueDate).toLocaleDateString()}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleEditTodo(todo)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => dispatch(deleteTodo(todo.id))}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          </Fade>
        ))}
      </List>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Todo' : 'Add New Todo'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={formData.dueDate}
                onChange={(newValue) =>
                  setFormData({ ...formData, dueDate: newValue })
                }
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="dense" />
                )}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TodoList;