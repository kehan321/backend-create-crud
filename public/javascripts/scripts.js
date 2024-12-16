document.addEventListener('DOMContentLoaded', () => {
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    editButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const id = button.getAttribute('data-id');
            const name = prompt('Enter new name:');
            const email = prompt('Enter new email:');
            const age = prompt('Enter new age:');

            if (name && email && age) {
                try {
                    await fetch(`/users/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, age })
                    });
                    window.location.reload();
                } catch (err) {
                    alert('Failed to update user.');
                }
            }
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const id = button.getAttribute('data-id');
            try {
                await fetch(`/users/${id}`, { method: 'DELETE' });
                window.location.reload();
            } catch (err) {
                alert('Failed to delete user.');
            }
        });
    });
});
