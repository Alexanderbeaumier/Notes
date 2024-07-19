document.getElementById('note-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const response = await fetch('/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    });
    if (response.ok) {
        loadNotes();
    }
});

document.getElementById('sort-button').addEventListener('click', () => {
    loadNotes();
});

async function loadNotes() {
    const sort = document.getElementById('sort').value;
    const order = document.getElementById('order').value;
    const response = await fetch(`/notes?sort=${sort}&order=${order}`);
    const notes = await response.json();
    const notesDiv = document.getElementById('notes');
    notesDiv.innerHTML = '';
    notes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note';
        noteDiv.innerHTML = `<h3>${note.title}</h3><p>${note.content}</p><small>Created at: ${new Date(note.created_at).toLocaleString()}</small>`;
        notesDiv.appendChild(noteDiv);
    });
}

loadNotes();

