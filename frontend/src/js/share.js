window.onload=()=>{
  document.querySelector('.dropbtn').onclick = ()=>{
    dropdown();
  }
  document.getElementsByClassName('sort_by').onclick = ()=>{
    showMenu(value);
  };
  dropdown = () => {
    var v = document.querySelector('.dropdown-content');
    var dropbtn = document.querySelector('.dropbtn')
    v.classList.toggle('show');
    dropbtn.style.borderColor = 'rgb(94, 94, 94)';
  }

  showMenu=(value)=>{
    var dropbtn_content = document.querySelector('.dropbtn_content');
    var dropbtn_click = document.querySelector('.dropbtn_click');
    var dropbtn = document.querySelector('.dropbtn');

    dropbtn_content.innerText = value;
  }
}
window.onclick= (e)=>{
  if(!e.target.matches('.dropbtn')){
    var dropdowns = document.getElementsByClassName("dropdown-content");

    var dropbtn_content = document.querySelector('.dropbtn_content');
    var dropbtn_click = document.querySelector('.dropbtn_click');
    var dropbtn = document.querySelector('.dropbtn');
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}