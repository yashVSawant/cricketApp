const post = document.getElementById('post');
const host = 'http://localhost:3333';
const token = localStorage.getItem('token');

const showTournaments = document.getElementById('showTournaments');

window.addEventListener('DOMContentLoaded',()=>{
    try {
        searchTournament()
    } catch (err) {
        alert(err.response.data.message);
    }
    
})

post.onclick = async()=>{
    const name = document.getElementById('name').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const address = document.getElementById('address').value;
    const password = document.getElementById('password').value;
    try {
        if(name , startDate ,endDate ,address ,password){
            const createdTournamentawait = await axios.post('/tournament/api/',{name , startDate ,endDate ,address ,password},{headers:{'Authorization':token}});
            displayTournaments(createdTournamentawait.data.tournament.id , name , startDate , endDate , address);
        }else{
            alert('please fill all filled');
        }
    } catch (err) {
        alert(err);
    }
    
}

async function searchTournament(){
    try {
        const tournaments = await axios.get('/tournament/api/',{headers:{'Authorization':token}});
        showTournaments.innerHTML = '';
        let tournamentArray = tournaments.data.tournaments;
        // let tournamentArray = [{id:1,name:'parakram chashak' ,startDate:'3/10/2001',endDate:'2/10/2002',address:'jamsut'},{id:2,name:'vikram chashak' ,startDate:'3/10/2000',endDate:'2/10/2001',address:'jamsut'}]
        tournamentArray = tournamentArray.reverse()
        tournamentArray.forEach(e=>{
            displayTournaments(e.id , e.name ,e.startDate ,e.endDate ,e.address);
        });
    } catch (err) {
        console.log(err)
    }
    
}

function displayTournaments(id , name , startDate , endDate , location){
    
    const div = document.createElement('div');
    div.innerHTML = `<div id="${id}" class="tournamentClass">
    <h4>${name}</h4><a>(${startDate} - ${endDate}) (${location})</a>
    <button class="start">start</button></div>`;
    showTournaments.appendChild(div);
}

showTournaments.addEventListener('click',(e)=>{
    if(e.target.classList.value === 'start'){
        localStorage.setItem('tournamentId',JSON.stringify(e.target.parentNode.id));
        window.location.href='../select-team/index.html';
    }
})