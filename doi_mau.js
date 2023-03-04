const socket = io()

const sttNhietDo = document.getElementById("nhietdo")
const sttDoAm = document.getElementById("doAm")
//const sttAnhSang = document.getElementById("anhSang")
const sttden = document.getElementById("den")
const sttdieuhoa = document.getElementById("dieuhoa")
  //var nhietdo = 0;
  socket.on("temp",function(data_received){
       nhietdo = data_received
      document.getElementById("temp_value").innerHTML = nhietdo + "°C"

      if(nhietdo <= 20){
        sttNhietDo.style.backgroundColor = "blue";
      }else if(nhietdo <= 30){
        sttNhietDo.style.backgroundColor = "red";
      }else{
        sttNhietDo.style.backgroundColor = "orange";
      }
      //thêm giá trị vào biểu đồ
      updatee.data.datasets[0].data.push(nhietdo)
      updatee.data.labels.push(new Date().getSeconds());
  })

//   var asd=0;
// var abc = setInterval(time,1000);
// function time(){
//     if(nhietdo>28){
//         if(confirm("Quá Nóng Bật Thiết Bị")){
//         clearInterval(abc);
//         asd = setInterval(timesa, 1000);
//         socket.emit("control_relay_2","1");
//         }else{
//         clearInterval(abc);
//         asd = setInterval(timesa, 1000);
//         }
//     }
// };
// function timesa(){
// if(nhietdo<=28){
//     if(confirm("Bạn Muốn Tắt Thiết Bị Không")){
//         clearInterval(asd);
//         abc = setInterval(time,1000);
//         socket.emit("control_relay_2","0");
//     }else{
//         clearInterval(asd);
//         abc = setInterval(time,1000);
//         socket.emit("control_relay_2","1");
// }
// }
// }
  socket.on("humi",function(data_received){
    let doam = data_received
    document.getElementById("humi_value").innerHTML = doam + "%"
    
    if(doam <= 10){
      sttDoAm.style.backgroundColor = "lightcyan";
    }else if(doam <= 65){
      sttDoAm.style.backgroundColor = "lightblue";
    }else{
      sttDoAm.style.backgroundColor = "blue";
    }

    updatee.data.datasets[1].data.push(doam)
  })

  socket.on("light",function(data_received){
    let anhsang = data_received
    document.getElementById("light_value").innerHTML = anhsang +" lux"

    if(anhsang <= 300){
      document.getElementById("as").style.backgroundColor = "green";
      socket.emit("control_relay_1","0");
      socket.emit("control_relay_2","0");
    }else if(anhsang <= 600){
      document.getElementById("as").style.backgroundColor = "white";
    }else{
      document.getElementById("as").style.backgroundColor = "gray";
      socket.emit("control_relay_1","1");
      socket.emit("control_relay_2","1");
    }

      updatee.data.datasets[2].data.push(anhsang)
      updatee.update()
      // if(updatee.data.labels.length > 5){
        updatee.data.labels.push(new Date().getSeconds());
        updatee.data.labels.shift()
      // }
  })

//thiết lập chart ban đầu
const updatee = new Chart("myChart", {
  type: "line",
  data: {
    labels: [],
    datasets: [{
        label: "Nhiệt độ",
        lineTension: 0.3,
        backgroundColor: "red",      // màu các điểm
        borderColor: "red",         //màu đường kẻ
        data: []
      },{
        label: "Độ ẩm",
        lineTension: 0.3,
        backgroundColor: "blue",      
        borderColor: "blue",         
        data: []
      },{
        label: "Ánh sáng",              
        lineTension: 0.3,
        backgroundColor: "yellow",      
        borderColor: "yellow",         
        data: []
      }
    ]
  },
  options: {
    scales: {
      x: {
        title:{
          display: false,
          text: "TIME (s)"
        }
      }
    }
  }
})



socket.on("relay_1",function(data_received){
  if(data_received == 1){
    document.getElementById("checkboxThreeInput_den").checked =true
    document.getElementById("light_img").src='/public/images/on_light.png'
    sttden.style.backgroundColor = "orange";
  } else{
    document.getElementById("checkboxThreeInput_den").checked = false
    document.getElementById("light_img").src='/public/images/off_light.png'
    sttden.style.backgroundColor = "DarkGray";
  }
})

socket.on("relay_2",function(data_received){
  if(data_received == 1){
    document.getElementById("checkboxThreeInput_tv").checked = true
    document.getElementById("tv_img").src='/public/images/on_tv.png'
    sttdieuhoa.style.backgroundColor = "PaleGreen";
  } else{
    document.getElementById("checkboxThreeInput_tv").checked = false
    document.getElementById("tv_img").src='/public/images/off_tv.png'
    sttdieuhoa.style.backgroundColor = "DarkGray";
  }
})


//bật 2 led
//  function bat2den(){
//   socket.emit("control_relay_1","1");
//   socket.emit("control_relay_2","1");
// }
// function tat2den(){
//   socket.emit("control_relay_1","0");
//   socket.emit("control_relay_2","0");
// }


function kiemtra_on_off_den(){
  let trangthai = document.getElementById("checkboxThreeInput_den")
  if(trangthai.checked == true){      
    var result = confirm(" bạn có muốn bật đèn không ? ")
      if(result){
        socket.emit("control_relay_1","1")
      } else {
        trangthai.checked = false
      }
  }else{
    var result_1 = confirm(" bạn có muốn tắt đèn không ? ")
    if(result_1){
    socket.emit("control_relay_1","0")
  }
  }
}

function kiemtra_on_off_tv(){
  let trangthai1 = document.getElementById("checkboxThreeInput_tv")
  if(trangthai1.checked == true){
    var result1 = confirm(" bạn có muốn bật tivi không ? ")
    if(result1){
    socket.emit("control_relay_2","1")
    } else {
      trangthai1.checked = false
    }
  }else{
    var result_2 = confirm(" bạn có muốn tắt tivi không ? ")
    if(result_2){
    socket.emit("control_relay_2","0")
  }
    }
}

                                   
//nhấn nút để xem chart
function showChart(){
  document.getElementById("myChart").style.opacity = "1"
  document.getElementById("nut_nhan_chart").remove()
}

// let person = prompt("Tên của bạn là gì ?");
// if (person == null || person == " ") {
//   document.getElementById('chao_mung').innerHTML = "Chào mừng quý khách lần đầu sử dụng"
// } else {
//   document.getElementById('chao_mung').insertAdjacentHTML("beforeend", person)
// }
