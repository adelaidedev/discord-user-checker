document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const userId = document.getElementById('userId').value;
    const userDetailsDiv = document.getElementById('userDetails');
    const errorDiv = document.getElementById('error');

    userDetailsDiv.innerHTML = '';
    userDetailsDiv.style.display = 'none';
    errorDiv.textContent = '';

    function checkIfTerminatedOrNotExist(userData) {
        return !userData || !userData.username;
    }

    fetch(`https://discordlookup.mesalytic.moe/v1/user/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found or API error.');
            }
            return response.json();
        })
        .then(data => {
            const isTerminatedOrNotExist = checkIfTerminatedOrNotExist(data);

            if (isTerminatedOrNotExist) {
                userDetailsDiv.style.display = 'block';
                userDetailsDiv.innerHTML = `
                    <p><strong>Status:</strong> Terminated or Account Doesn't Exist</p>
                `;
            } else {
                userDetailsDiv.style.display = 'block';
                userDetailsDiv.innerHTML = `
                    <p><strong>Username:</strong> ${data.username || 'N/A'}</p>
                    <p><strong>User ID:</strong> ${data.id}</p>
                    <p><strong>Global Name:</strong> ${data.global_name || 'N/A'}</p>
                    <p><strong>Created At:</strong> ${new Date(data.created_at).toLocaleString()}</p>
                    <p><strong>Accent Color:</strong> ${data.banner?.color || 'N/A'}</p>
                    <p><strong>Avatar:</strong><br><img src="${data.avatar.link}" alt="Avatar" width="100"></p>
                    <p><strong>Status:</strong> Active</p>
                `;
            }
        })
        .catch(err => {
            errorDiv.textContent = "Terminated or Account Doesn't Exist";
        });

    fetch(`https://discordlookup.mesalytic.moe/v1/application/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Application not found or API error.');
            }
            return response.json();
        })
        .then(data => {
            userDetailsDiv.innerHTML += `
                <h3>Application Details</h3>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Description:</strong> ${data.description}</p>
                <p><strong>Icon:</strong><br><img src="${data.icon}" alt="Icon" width="100"></p>
                <p><strong>Public:</strong> ${data.bot_public ? 'Yes' : 'No'}</p>
                <p><strong>Privacy Policy:</strong> <a href="${data.privacy_policy_url}" target="_blank">Link</a></p>
                <p><strong>Terms of Service:</strong> <a href="${data.terms_of_service_url}" target="_blank">Link</a></p>
            `;
        })
        .catch(err => {
            console.log('Application not found or API error.');
        });

    fetch(`https://discordlookup.mesalytic.moe/v1/guild/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Guild not found or API error.');
            }
            return response.json();
        })
        .then(data => {
            userDetailsDiv.innerHTML += `
                <h3>Guild Details</h3>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Presence Count:</strong> ${data.presence_count}</p>
            `;
        })
        .catch(err => {
            console.log('Guild not found or API error.');
        });
});
