const socket = io();
const tournamentId = (localStorage.getItem('tournamentId'));
const token = localStorage.getItem('token');
const matchId = localStorage.getItem('matchId');
let runs = 0;
let target = 0;
let wickets = 0;
let overs =0;
let balls = 0;
let inning = 1;
let currentOver = "";
let currentBall = 0;
let extra = "";
let declaire = "";
let strike1 = true;
let batterCount = 0;
let ballerCount = 0;
let onCrease1 = 0;
let onCrease2 = 0;
let bowlerId = 0;
let bowlerOvers = 0;

let batter1Runs = 0;
let batter1Sixes = 0;
let batter1Fours =0;
let batter1balls =0;

let batter2Runs = 0;
let batter2Sixes = 0;
let batter2Fours =0;
let batter2balls =0;

let currentBallerRuns = 0;
let currentBallerwickets = 0;
let currentBallerOvers = 0.0;

let team1 =[];
let team2 =[];
const bowlerIdArray = [];
const batterIdArray = [];

let matchOvers = 0;

const run  = document.getElementById('oneRun');
const fourRun = document.getElementById('fourRun');
const sixRun = document.getElementById('sixRun');
const noBall = document.getElementById('noBall');
const wideBall = document.getElementById('wideBall');
const byes = document.getElementById('byes');
const wicketButton = document.getElementById('wicketButton')
const add = document.getElementById('add');
const cancle = document.getElementById('cancle');
const diclaireZone = document.getElementById('diclaire');
const addBatter =document.getElementById('addBatter');
const start = document.getElementById('start');
const changeStrike = document.getElementById('changeStrike');
const player1 = document.getElementById('batterStats1');
const player2 = document.getElementById('batterStats2');

socket.on('getUpdate',(data,typeOfdata)=>{
    console.log(data , typeOfdata)
})

window.addEventListener('DOMContentLoaded',async()=>{
    const oversMatch1 = document.getElementById('oversMatch1');
    const oversMatch2 = document.getElementById('oversMatch2');
    const battingFirst = localStorage.getItem('battingFirst');
    const team1Name = localStorage.getItem('name1');
    const team2Name = localStorage.getItem('name2');
    const showName1 = document.getElementById('team1Name');
    const showName2 = document.getElementById('team2Name');
    console.log(team1Name , team2Name)
    
    matchOvers = localStorage.getItem('matchOvers');
    oversMatch1.innerText = matchOvers;
    oversMatch2.innerText = matchOvers;
    if(battingFirst === 'team1'){
        showName1.innerText = team1Name;
        showName2.innerText = team2Name;
        team1 = JSON.parse(localStorage.getItem('team1'));
        team2 = JSON.parse(localStorage.getItem('team2'));
    }else{
        showName1.innerText = team2Name;
        showName2.innerText = team1Name;
        team1 = JSON.parse(localStorage.getItem('team2'));
        team2 = JSON.parse(localStorage.getItem('team1'));
    }

    team1.forEach((player)=>{
        showPlayer(1,player.id, player.name)
        
    })
    team2.forEach((player)=>{
        showPlayer(2,player.id, player.name)
        
    })
    socket.emit('watch-score',tournamentId);
})



run.onclick = ()=>{
    currentBall++;
    previewRuns()
};
fourRun.onclick = ()=>{
    declaire = "four";
    currentBall +=4;

    previewRuns()
};
sixRun.onclick = ()=>{
    declaire = "six";
    currentBall +=6;
    previewRuns()
};
noBall.onclick = ()=>{
    extra = 'no!';
    previewRuns()
};
wideBall.onclick = ()=>{
    extra = 'wide!';
    previewRuns()
};
byes.onclick = ()=>{ 
    extra ='byes!';
    previewRuns()
};
diclaireZone.onclick = ()=>{
    declaire = "runs"
};

wicketButton.onclick = ()=>{
    extra = 'WICKET!';
    previewRuns()
};
add.onclick = ()=>{
    if(!onCrease1)alert('please select batsman on field');
    else if(!onCrease2)alert('please select batsman on field');
    else if(!bowlerId)alert('please select current bowler');
    else{
        try {
                updatebatterRuns();
                displayBatterStats();
                updateCurrentOver();
                updateScore();
                isValidBall();
                displayRuns();
                
                displayOver();
                displayWickets();
                updateBowlerStats();
                displayBowler();
                clearShowDiv();
                isMatchOver();
                isOver();
                uploadScore();
            } catch (error) {
                console.log(error)
            alert('somthing went wrong');
            }
    }
    

};
cancle.onclick = ()=>{
    clearShowDiv();
};
changeStrike.onclick = ()=>{
    strike1 = !strike1;
    checkStrike();
}

player1.addEventListener('click',(e)=>{
    try {
        if(e.target.classList.value === 'addInAction'){
            const id = +(e.target.parentNode.id);
            const name = document.getElementById(`1batterName${id}`).innerText;
            // console.log('inning',inning);
            if(inning===1){
                    if(!onCrease1 || !onCrease2){
                        if(!batterIdArray.includes(id)){
                            batterIdArray.push(id)
                            e.target.parentNode.parentNode.removeChild(e.target.parentNode);
                            createNewBatter(id,name,1);
                        }else{
                            alert('batter can not repeat');
                        }
                    }else{
                        alert('can not enter before wicket')
                    }
            }else{
                // console.log('inning',inning,'bowlerId',bowlerId);
                if(!bowlerId){
                    bowlerId = id;
                    if(!bowlerIdArray.includes(id)){
                        bowlerIdArray.push(id);
                        createNewBaller(id ,name);
                    }else{
                        const currentBallerName = document.getElementById('currentBallerName');
                        currentBallerName.innerText = name;
                        bowlerOvers = +(document.getElementById(`${inning}ballerOvers${id}`).innerText);
                        currentBallerwickets = +(document.getElementById(`${inning}ballerWickets${id}`));
                        currentBallerRuns = +(document.getElementById(`${inning}ballerRuns${id}`));
                    }
                    
                };
                
            }
            
        }
    } catch (error) {
        console.log(error)
    }

})
player2.addEventListener('click',(e)=>{
    try {
        if(e.target.classList.value === 'addInAction'){
            const id = e.target.parentNode.id;
            const name = document.getElementById(`2batterName${id}`).innerText;
            if(inning===2){
                
                if(!onCrease1 || !onCrease2){
                    if(!batterIdArray.includes(id)){
                        batterIdArray.push(id)
                        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
                        createNewBatter(id,name,2);
                    }else{
                        alert('batter can not repeat');
                    }
                }else{
                    alert('can not enter before wicket')
                }
            }else{
                
                if(!bowlerId){
                    bowlerId = id;
                    if(!bowlerIdArray.includes(id)){
                        bowlerIdArray.push(id);
                        createNewBaller(id ,name);
                    }else{
                        const currentBallerName = document.getElementById('currentBallerName');
                        currentBallerName.innerText = name;
                        bowlerOvers = +(document.getElementById(`${inning}ballerOvers${id}`).innerText);
                        currentBallerwickets = +(document.getElementById(`${inning}ballerWickets${id}`).innerText);
                        currentBallerRuns = +(document.getElementById(`${inning}ballerRuns${id}`).innerText);
                        
                    }
                    
                }
                
            }
            
        }
    } catch (error) {
        console.log(error)
    }
    
})

function updateBowlerStats(){
    if(extra === 'wide!'|| extra === 'no!'){
        currentBallerRuns++;
    }
    if(extra != 'byes!'){
        currentBallerRuns += currentBall;
    }
}

function displayBowler(){
    const id=bowlerId;
    const oversBowled = document.getElementById(`${inning}ballerOvers${id}`); 
    const runsGiven = document.getElementById(`${inning}ballerRuns${id}`);
    const runRate = document.getElementById(`${inning}rr${id}`);
    if(balls === 6) oversBowled.innerText = `${bowlerOvers+1}`;
    else oversBowled.innerText = `${bowlerOvers}.${balls}`;
    runsGiven.innerText = currentBallerRuns;
    runRate.innerText = (Math.round(currentBallerRuns/((bowlerOvers*6)+balls)*6)*100)/100;
    const overdata = bowlerOvers*10+balls;
    socket.emit('bowler-update',bowlerId,inning,overdata ,currentBallerRuns, tournamentId);
    const overNumber = ((bowlerOvers*10)+balls);
    axios.put(`/match/api/${matchId}/bowler/updates`,{userId:id,runs:currentBallerRuns,overs:overNumber},{headers:{'Authorization':token}})
}

function updatebatterRuns(){
    if(strike1){
        if(declaire === "four"){
            batter1Fours++;
        }
        if(declaire === "six"){
            batter1Sixes++;
        }
        if(extra !='wide!'){
            batter1balls++;
        }
        if(extra !='byes!' && extra !='wide!'){
            batter1Runs += currentBall;
        }
    }else{
        if(declaire === "four"){
            batter2Fours++;
        }
        if(declaire === "six"){
            batter2Sixes++;
        }
        if(extra !='wide!'){
            batter2balls++;
        }
        if(extra !='byes!' && extra !='wide!'){
            batter2Runs += currentBall;
        }
    }
}

function displayBatterStats(){
    let id;
    if(strike1)id=onCrease1;
    else id=onCrease2;
    const batterRuns = document.getElementById(`${inning}batterRuns${id}`);
    const batterBalls = document.getElementById(`${inning}batterBalls${id}`);
    const batterSixes = document.getElementById(`${inning}sixes${id}`);
    const batterFours = document.getElementById(`${inning}fours${id}`);
    const batterSr = document.getElementById(`${inning}sr${id}`);

    if(strike1){
        batterRuns.innerText = batter1Runs;
        batterBalls.innerText = batter1balls; 
        batterSixes.innerText = batter1Sixes;
        batterFours.innerText = batter1Fours;
        batterSr.innerText = Math.round((batter1Runs/batter1balls)*100)/100;
        socket.emit('batter-update',onCrease1,inning,batter1Runs,batter1Sixes,batter1Fours,batter1balls, tournamentId);
        axios.put(`/match/api/${matchId}/batter/updates`,{userId:onCrease1,runs:batter1Runs,fours:batter1Fours,sixes:batter1Sixes,balls:batter1balls,state:'not out'},{headers:{'Authorization':token}})
    }else {
        batterRuns.innerText = batter2Runs;
        batterBalls.innerText = batter2balls; 
        batterSixes.innerText = batter2Sixes;
        batterFours.innerText = batter2Fours;
        batterSr.innerText = Math.round((batter2Runs/batter2balls)*100)/100;
        socket.emit('batter-update',onCrease2,inning,batter2Runs,batter2Sixes,batter2Fours,batter2balls, tournamentId);
        axios.put(`/match/api/${matchId}/batter/updates`,{userId:onCrease2,runs:batter2Runs,fours:batter2Fours,sixes:batter2Sixes,balls:batter2balls,state:'not out'},{headers:{'Authorization':token}})
    }
    if(declaire != 'runs'){
        if((currentBall%2 === 1)){
            strike1 = !strike1;
            checkStrike();
        }
    }
}

function createNewBaller(id,name){
    const table = document.getElementById(`ballersTable${inning}`);
    const currentBallerName = document.getElementById('currentBallerName');
    const row = document.createElement('tr');

    currentBallerName.innerText = name;
    row.id = `bowler${id}`;
    row.innerHTML =`
                        <td id="${inning}ballerName${id}">${name}</td>
                        <td id="${inning}ballerOvers${id}">0</td>
                        <td id="${inning}ballerWickets${id}">0</td>
                        <td id="${inning}ballerRuns${id}">0</td>
                        <td id="${inning}rr${id}">0</td>
                        
    `;
    socket.emit('new-bowler',id,inning, tournamentId);
    table.appendChild(row);
    axios.post(`/match/api/${matchId}/bowler/updates`,{userId:id},{headers:{'Authorization':token}})
};

function createNewBatter(id,name,teamNo){
    const table = document.getElementById(`battersTable${teamNo}`);
    const row = document.createElement('tr');
    row.id=`${id}`;
    row.innerHTML =`
        <td id="${teamNo}batterName${id}">${name}</td>
        <td id="${teamNo}batterRuns${id}">0</td>
        <td id="${teamNo}batterBalls${id}">0</td>
        <td id="${teamNo}sixes${id}">0</td>
        <td id="${teamNo}fours${id}">0</td>
        <td id="${teamNo}sr${id}">0</td>
        <button class="addInAction"> + </button>
    `;
    socket.emit('new-batter',id,inning, tournamentId);
    table.appendChild(row);
    axios.post(`/match/api/${matchId}/batter/updates`,{userId:id},{headers:{'Authorization':token}})
    addBatterOnField(id);
}

function showPlayer(teamNo,id ,name){
    const table = document.getElementById(`table${teamNo}2`);
    const row = document.createElement('tr');
    row.id=`${id}`;
    row.innerHTML =`
        <td id="${teamNo}batterName${id}">${name}</td>
        <button class="addInAction"> + </button>
    `;

    table.appendChild(row);
}

function updateScore(){
    if(extra === 'WICKET!'){
        wickets++;   
    }
    if(extra === 'wide!'){
        runs++;   
    }
    if(extra === 'no!'){
        runs++;
    }
    // console.log(currentBall)
    runs += currentBall;
    // console.log(currentBall , runs);
}

function displayRuns(){
    const showRuns = document.getElementById(`runs${inning}`);
    showRuns.innerText = runs;
    socket.emit('score',inning,runs ,'runs',overs ,balls,tournamentId);

}
function displayWickets(){
    if(extra==='WICKET!'){
        const showWickets = document.getElementById(`wickets${inning}`);
        showWickets.innerText = wickets;
        socket.emit('score',inning,wickets ,'wickets',overs ,balls ,tournamentId);
        whichBatter();
    }
}
function whichBatter(){
    const id = bowlerId
    console.log(id);
    const player1 = document.getElementById(`${onCrease1}`);
    const player2 = document.getElementById(`${onCrease2}`);

    const del1 = document.createElement('button');
    const del2 = document.createElement('button');
    del1.innerText = 'X';
    del2.innerText = 'X';

    del1.style.backgroundColor = 'red';
    del2.style.backgroundColor = 'red';

    player1.appendChild(del1);
    player2.appendChild(del2);

    del1.onclick = ()=>{
        console.log(id)
        del2.parentNode.removeChild(del2)
        completeWicketProcess(onCrease1,del1,id);
    }
    del2.onclick = ()=>{
        
        del1.parentNode.removeChild(del1);
        completeWicketProcess(onCrease2,del2,id);
    }
}

function displayOver(){
    const showOver = document.getElementById(`over${inning}`);
    const showBalls = document.getElementById(`balls${inning}`);

    showOver.innerText = overs;
    showBalls.innerText = balls;
}

function previewRuns(){
    const show = document.getElementById('show');
    if(currentBall != 0 )show.innerText = currentBall+extra;
    else show.innerText = extra;
}

function clearShowDiv(){
    extra = "";
    currentBall =0;
    declaire = ""
    previewRuns();
}

function updateCurrentOver(){
    let fixZone = "";
    const currentOverData = document.getElementById('currentOverData'); 
    if(declaire === 'runs') fixZone = "diclare";
    if(extra === 'WICKET!' && currentBall === 0) currentOver = currentOver + "_ " + extra +fixZone;
    else currentOver = currentOver + "_ " + currentBall + extra +fixZone;
    const div = document.createElement('div');
    div.innerHTML = `<div> ${currentBall + extra +fixZone}</div>`;
    div.classList = 'box';
    currentOverData.appendChild(div)
}

function isValidBall(){
    if(extra !== "wide!" && extra !== "no!"){
        balls++;
        // ballersBallCount();
    }
}

function isOver(){
    if(balls === 6){
        const allOverData = document.getElementById('allOverData');
        const options = document.createElement('option');
        options.innerText = currentOver;
        allOverData.appendChild(options);
        clearCurrentOver()
        currentOver='';
        overs++;
        balls=0;
        displayOver();
        strike1 = !strike1;
        checkStrike();
        isInningOver();
    }
    
}
async function inningEnd(){
    await axios.put(`/match/api/${matchId}/update`,{inning,runs,wickets,overs,balls},{headers:{'Authorization':token}});
    target = runs;
    runs = 0;
    wickets = 0;
    overs =0;
    balls = 0;
    inning = 2;
    currentOver = "";
    currentBall = 0;
    bowlerOvers = 0;
    extra = "";
    declaire = "";
    batterCount =0;
    strike1 = true;
    onCrease1 =0;
    onCrease2 =0;
    bowlerId = 0 ;
    clearBatter1Data();
    clearBatter2Data();
    clearBowlerData();
    
}

async function matchEnd(){
    await axios.put(`/match/api/${matchId}/update`,{inning,runs,wickets,overs,balls},{headers:{'Authorization':token}});
    const team1Name = document.getElementById('team1Name').innerText;
    const team2Name = document.getElementById('team2Name').innerText;
    const updateButtons = document.getElementById('updateButtons');
    let wonTeam ="match";
    let result = "won";
    if(runs > target)wonTeam = team2Name;
    else if(runs < target) wonTeam = team1Name;
    else result = "tied"
    alert(`${wonTeam} ${result} !`);
    alert('match end');
    inningEnd();
    await axios.put(`/match/api/endMatch`,{},{headers:{'Authorization':token}})
    updateButtons.style.display = 'none'
    window.location.href = '../organization-home/index.html'
}

async function isInningOver(){
    if(overs === +matchOvers || wickets == 10){
        
        if(inning===1){
            
            inningEnd();
            alert('first inning completed second inning starting');
        }else{
            
            matchEnd();
        }
    }else{
        clearBowlerData();
        // enterBallersName();
    }
}
function isMatchOver(){
    if(inning === 2 && runs > target){
        matchEnd();
    }
}

function clearCurrentOver(){
    const currentOverData = document.getElementById('currentOverData');
    currentOverData.innerHTML="";
}

function completeWicketProcess(id,button ,bId){

    const div = document.createElement('div');
        div.innerHTML =`<select id="typeOfWicket">
        <option selected>bowled</option>
        <option>catch</option>
        <option>run out</option>
        <option>stump</option>
        <option>obstruction</option>
        <option>misbehave</option>
        </select>
        <button id="addTypeOfWicket">add</button>`;
        button.parentNode.appendChild(div)
        button.parentNode.removeChild(button);

        const addTypeOfWicket = document.getElementById('addTypeOfWicket');
        addTypeOfWicket.onclick = ()=>{
            const battersName = document.getElementById(`${inning}batterName${id}`);
            const select = document.getElementById('typeOfWicket');
            const type = select.value;
            const name = battersName.innerText;
            battersName.innerText = `${name} (${type})`;
            addTypeOfWicket.parentNode.parentNode.style.backgroundColor = 'white'
            addTypeOfWicket.parentNode.parentNode.removeChild(addTypeOfWicket.parentNode);
            if(type === 'bowled' || type==='stump' || type ==='catch')addWicketToBaller(bId,type);
            (async function execute(){
                try {   
                    if(id === onCrease1)await axios.put(`/match/api/${matchId}/batter/updates`,{userId:id,runs:batter1Runs,fours:batter1Fours,sixes:batter1Sixes,balls:batter1balls,state:`${type}`},{headers:{'Authorization':token}})
                        else await axios.put(`/match/api/${matchId}/batter/updates`,{userId:id,runs:batter2Runs,fours:batter2Fours,sixes:batter2Sixes,balls:batter2balls,state:`${type}`},{headers:{'Authorization':token}})
                
                    await axios.put(`/match/api/${matchId}/update`,{inning,runs,wickets,overs,balls},{headers:{'Authorization':token}});
                
                } catch (err) {
                    console.log(err)
                }
                
            })();
            socket.emit('batter-out' ,id ,inning,type,'wicket',tournamentId)
            if(id === onCrease1){
                clearBatter1Data();
            }else{
                clearBatter2Data();
            }
            if(wickets == 10){
                if(inning === 1)inningEnd();
                else matchEnd();
            }
                
        }
}

function highLightStrikeBatter(id1,id2){
    const strikeDiv = document.getElementById(`${id1}`);
    strikeDiv.style.backgroundColor = 'blue';

    const nonStrike = document.getElementById(`${id2}`);
    nonStrike.style.backgroundColor = 'white';
}

function checkStrike(){
    if(strike1)highLightStrikeBatter(onCrease1,onCrease2);
    else highLightStrikeBatter(onCrease2,onCrease1);
}

function clearBatter1Data(){
    batter1Runs = 0
    batter1Fours = 0;
    batter1Sixes = 0;
    batter1balls = 0;
    onCrease1 = 0;
}

function clearBatter2Data(){
    batter2Runs = 0
    batter2Fours = 0;
    batter2Sixes = 0;
    batter2balls = 0;
    onCrease2 = 0;
}

function clearBowlerData(){
    bowlerId = 0;
    currentBallerwickets=0;
    bowlerOvers=0;
    currentBallerRuns=0;
}

async function addWicketToBaller(id){
    const wicketsTaken = document.getElementById(`${inning}ballerWickets${id}`);
    const wickets = +(wicketsTaken.innerText);
    wicketsTaken.innerText = wickets+1;
    socket.emit('bowler-wicket',id,inning,wickets+1 , tournamentId);
    await axios.put(`/match/api/${matchId}/bowler/wicket/updates`,{userId:id,wickets:wickets+1},{headers:{'Authorization':token}})
}
function addBatterOnField(id){
    if(onCrease1===0)onCrease1 = id;
    else onCrease2 =id;
}

async function uploadScore(){
    try {
        console.log(inning,runs,wickets,overs,balls)
        await axios.put(`/match/api/${matchId}/update`,{inning,runs,wickets,overs,balls},{headers:{'Authorization':token}});
    } catch (err) {
        console.log(err)
    }
    
}