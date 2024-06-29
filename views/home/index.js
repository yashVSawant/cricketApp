const profile = document.getElementById('profile');
const tournaments = document.getElementById('tournaments');
const showTeam = document.getElementById('showTeam');
const createTeam = document.getElementById('createTeam');
const displayPlayers = document.getElementById('displayPlayers');
const create = document.getElementById('create');

let teamId = 0;

const host = 'http://localhost:3333';
const token = localStorage.getItem('token');

window.addEventListener('DOMContentLoaded',async()=>{
    try {
        const info = await axios.get('/tournament/api/ongonigTournaments',{headers:{'Authorization':token}});
        console.log(info.data.info)
        info.data.info.forEach((t)=>{
            displayTournaments(t.id , t.name ,t.startDate ,t.endDate ,t.address);
        });
        const data = await axios.get('/team/api/',{headers:{'Authorization':token}});
        console.log(data.data)
        data.data.team.forEach((t)=>{
            displayTeam(t.id ,t.name);
        });
        
    } catch (err) {
        alert(err.response.data.message);
    }
    
})

profile.onclick = async()=>{
    window.location.href = '../profile/index.html';
    
}
createTeam.onclick = ()=>{
    const createTeamDiv = document.getElementById('createTeamDiv');
    createTeamDiv.style.display = 'inline'
}

create.onclick = async()=>{
    const name = document.getElementById('name').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if(name && password && confirmPassword){
        if(password === confirmPassword){
            try {
                const post = await axios.post('/team/api/',{name , password },{headers:{'Authorization':token}});
                const createTeamDiv = document.getElementById('createTeamDiv');
                createTeamDiv.style.display = 'none';
                alert('team posted');
                displayTeam(post.data.team.id ,post.data.team.name);
            } catch (err) {
                console.log(err)
                alert('something went wrong!')
            }
        }else{
            alert('password did not match')
        }
    }else{
        alert('please fill all fields')
    }
    
}

tournaments.addEventListener('click',(e)=>{
    if(e.target.classList.value === 'watchScore'){
        const id =e.target.parentNode.id;
        localStorage.setItem('tournamentId',id);
        window.location.href = '../score/index.html'
    }
})

showTeam.addEventListener('click',async(e)=>{
    if(e.target.classList.value === 'player'){
        const id = e.target.parentNode.id;
        const data = await axios.get(`/team/api/${id}/players`,{headers:{'Authorization':token}});
        tournaments.style.display = 'none';
        displayPlayers.innerHTML= '';
        addBackButton();
        displayInputDiv();
        data.data.players.forEach((p)=>{
            showPlayers(p.id ,p.name);
        })
        teamId = e.target.parentNode.id;
    }
})

displayPlayers.addEventListener('click',async(e)=>{
    if(e.target.classList.value === 'remove'){
        try {
            const id = e.target.parentNode.id;
            await axios.delete(`/team/api/${teamId}/${id}/remove`,{headers:{'Authorization':token}});
            e.target.parentNode.parentNode.removeChild(e.target.parentNode)
        } catch (err) {
            console.log(err)
            alert('something went wrong')
        }
        

    }
})

function displayTournaments(id , name , startDate , endDate , location){
    const div = document.createElement('div');
    div.innerHTML = `<div id="${id}">
    <h4>${name}</h4><a>(${startDate} - ${endDate}) (${location})</a>
    <button class="watchScore">watch score</button>
    </div>`;
    tournaments.appendChild(div);
}

function displayTeam(id ,name){
    const div = document.createElement('div');
    div.innerHTML = `<div id="${id}" class="teamDiv">
    <h4>${name}</h4>
    <button class="player">players</button>
    </div>`;
    showTeam.appendChild(div);
}

function showPlayers(id ,name){
    
    const div = document.createElement('div');
    div.innerHTML = `<div id="${id}" class="playerDiv">
    <h4>${name}</h4>
    <button class="remove">remove</button>
    </div>`;
    displayPlayers.appendChild(div);
}

function addBackButton(){
    const div = document.createElement('div');
    div.innerHTML = '<button id="back">Back</button>'
    displayPlayers.appendChild(div);

    const back = document.getElementById('back');

    back.onclick = ()=>{
        displayPlayers.innerHTML= '';
        tournaments.style.display = 'inline';
    }
}

function displayInputDiv(){
    const div = document.createElement('div');
    div.innerHTML =`<div >
                <label>player email:</label>
                <input type="text" id="playerEmail">
                <label>password:</label>
                <input type="password" id="playerPassword">
                <button id="add">add</button>
            </div>`;
    displayPlayers.appendChild(div);
    const add = document.getElementById('add');
    add.onclick = async()=>{
        const email = document.getElementById('playerEmail').value;
        const password = document.getElementById('playerPassword').value;
        if(email && password){
            const playerData = await axios.post('/team/api/addPlayer',{email,password,teamId} ,{headers:{'Authorization':token}});
            const player = playerData.data.player;
            showPlayers(player.id ,player.name)
        }else{
            alert('please fill all fields!')
        }
        
    }
}