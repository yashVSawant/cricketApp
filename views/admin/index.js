const submit = document.getElementById('submit');
const token = localStorage.getItem('token');
const showOrganizations = document.getElementById('showOrganizations');

window.addEventListener('DOMContentLoaded',async()=>{
    try {
        loadOrgnaization();
        
    } catch (err) {
        console.log(err)
    }
    
})


submit.addEventListener('click',async(e)=>{
    e.preventDefault();
    try {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const village = document.getElementById('village').value;
        const taluka = document.getElementById('taluka').value;
        if(!name || !email || !village || !taluka )throw new Error('please fill all fields')
        const data = await axios.post('/organization/api/',{name,email,village,taluka},{headers:{'Authorization':token}});
        console.log(data.data)
        document.getElementById('name').value="";
        document.getElementById('email').value="";
        document.getElementById('confirmPassword').value="";
        document.getElementById('village').value="";
        document.getElementById('taluka').value="";
        loadOrgnaization();
    } catch (err) {
        const message = err.response?.data.message? err.response.data.message:err.message;
        alert(message);
    }
    
}) 

function displayOrganizations(id ,name ){
    const div = document.createElement('div');
    div.innerHTML = `<h3 id="${id}">${name}</h3><button class="info">info</button> <button class="block">block</button>`;
    div.className = 'organization'
    showOrganizations.appendChild(div);
}

async function loadOrgnaization(){
    const data = await axios.get('/organization/api/',{headers:{'Authorization':token}});
        showOrganizations.innerHTML = ""
        data.data.organizations.forEach((o)=>{
            displayOrganizations(o.id ,o.name)
        })
}