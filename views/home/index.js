
const profile = document.getElementById('profile');

const host = 'http://localhost:3333';
const token = localStorage.getItem('token');

window.addEventListener('DOMContentLoaded',async()=>{
    try {
        const info = await axios.get('/tournament/api/ongonigTournaments',{headers:{'Authorization':token}});
        console.log(info.data.info)
        info.data.info.forEach(e=>{
            displayTournaments(e.id , e.name ,e.startDate ,e.endDate ,e.address);
        });
    } catch (err) {
        alert(err.response.data.message);
    }
    
})

profile.onclick = async()=>{
    window.location.href = '../profile/index.html';
    
}

function displayTournaments(id , name , startDate , endDate , location){
    const tournaments = document.getElementById('tournaments');
    const div = document.createElement('div');
    div.innerHTML = `<div id="${id}">
    <h4>${name}</h4><a>(${startDate} - ${endDate}) (${location})</a>
    </div>`;
    tournaments.appendChild(div);
}