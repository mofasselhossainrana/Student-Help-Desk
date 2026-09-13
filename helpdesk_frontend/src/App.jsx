import { useState, useEffect } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tickets, setTickets] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

  const [view, setView] = useState('list');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setMessage('Login successful!');
        setIsLoggedIn(true);
        fetchTickets();
      } else {
        setMessage('Login failed. Check username/password.');
      }
    } catch (error) {
      setMessage('Error connecting to server.');
      console.log(error);
    }
  };

  const fetchTickets = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch('http://127.0.0.1:8000/api/tickets/', {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });

    const data = await response.json();
    setTickets(data);
  };

  const handleCreateTicket = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch('http://127.0.0.1:8000/api/tickets/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token,
      },
      body: JSON.stringify({
        title: title,
        description: description,
        priority: priority,
      }),
    });

    if (response.ok) {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      fetchTickets();
    } else {
      console.log('Failed to create ticket');
    }
  };

  const openTicketDetail = async (ticket) => {
    setSelectedTicket(ticket);
    setView('detail');
    fetchComments(ticket.id);
  };

  const fetchComments = async (ticketId) => {
    const token = localStorage.getItem('token');

    const response = await fetch('http://127.0.0.1:8000/api/comments/', {
      method: 'GET',
      headers: {
        Authorization: 'Token ' + token,
      },
    });

    const data = await response.json();
    const filtered = data.filter((c) => c.ticket === ticketId);
    setComments(filtered);
  };

  const handleAddComment = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch('http://127.0.0.1:8000/api/comments/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token,
      },
      body: JSON.stringify({
        content: newComment,
        ticket: selectedTicket.id,
      }),
    });

    if (response.ok) {
      setNewComment('');
      fetchComments(selectedTicket.id);
    } else {
      console.log('Failed to add comment');
    }
  };

  const backToList = () => {
    setView('list');
    setSelectedTicket(null);
    setComments([]);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchTickets();
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div>
        <h1>Student Help Desk - Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={handleLogin}>Login</button>
        <p>{message}</p>
      </div>
    );
  }

  if (view === 'detail' && selectedTicket) {
    return (
      <div>
        <button onClick={backToList}>← Back to List</button>

        <h1>{selectedTicket.title}</h1>
        <p>Status: {selectedTicket.status}</p>
        <p>Priority: {selectedTicket.priority}</p>
        <p>Description: {selectedTicket.description}</p>

        <h3>Comments</h3>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>{comment.content}</li>
          ))}
        </ul>

        <textarea
          placeholder="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <br />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Tickets</h1>

      <h3>Create New Ticket</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
      <br />
      <button onClick={handleCreateTicket}>Create Ticket</button>

      <h3>All Tickets</h3>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id} onClick={() => openTicketDetail(ticket)} style={{ cursor: 'pointer' }}>
            {ticket.title} — {ticket.status} — {ticket.priority}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;