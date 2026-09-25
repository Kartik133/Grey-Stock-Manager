var database;
var add_raw_mat,add_made_mat,check_stock,no_of_rows,set;
var state=0;
var raw_mat_form=[],mat_made_form=[],lot_numbers=[];

function setup() {
  createCanvas(displayWidth,displayHeight);

  database = firebase.database();

  textSize(20);
  noStroke();
  fill(0);

  add_raw_mat = createButton("Add Raw Material");
  add_raw_mat.position(displayWidth/2-100,displayHeight/2-50);
  add_raw_mat.mouseReleased(()=>{
    state=1;
  })

  add_made_mat = createButton("Add Made Material");
  add_made_mat.position(displayWidth/2-100,displayHeight/2);
  add_made_mat.mouseReleased(()=>{
    state=3;
  })

  check_stock = createButton("Check Stock");
  check_stock.position(displayWidth/2-100,displayHeight/2+50);
  check_stock.mouseReleased(()=>{
    state=5;
  })

  set = createButton("Set");
  set.position(625,70);
  set.mouseReleased(async ()=>{
    if(state==1) {
      no_of_rows.attribute("disabled",""); 
      createForm();
      state=2;
    }else if(state==2) {
      for(let i=0;i<no_of_rows.value();i++) {
        let arr = raw_mat_form[i][2].value().split(",").map(Number);
        let quantity = 0;
        for(let k=1;k<arr.length;k+=2) {
          quantity+=arr[k];
        }
        database.ref("lot_numbers/"+raw_mat_form[i][1].value()).set({
          fabric:raw_mat_form[i][0].value(),
          colour_chart:raw_mat_form[i][2].value(),
          rate:raw_mat_form[i][3].value(),
          cut:raw_mat_form[i][4].value(),
          quantity:quantity,
          base_rate:raw_mat_form[i][4].value()*raw_mat_form[i][3].value(),
          quantity_made:0,
          design_number:null
        });
      }
      for(let i=0;i<no_of_rows.value();i++) {
        for(let j=0;j<5;j++) {
          raw_mat_form[i][j].hide();
        }
      }
      raw_mat_form=[];
      no_of_rows.value(0);
      set.position(625,70);
      no_of_rows.removeAttribute("disabled");
      state=0;
    }else if(state==3) {
      no_of_rows.attribute("disabled",""); 
      createForm_two();
      state=4;
    }else if(state==4) {
      for(let i=0;i<no_of_rows.value();i++) {
        let temp = await loadData(i);
        database.ref("lot_numbers/"+mat_made_form[i][0].value()).update({
          quantity_made:temp+Number(mat_made_form[i][2].value())
        });
        database.ref("lot_numbers/"+mat_made_form[i][0].value()+"/design_numbers/").set({
          [mat_made_form[i][1].value()]:[mat_made_form[i][3].value(),mat_made_form[i][4].value(),mat_made_form[i][2].value()]
        });
      }
      for(let i=0;i<no_of_rows.value();i++) {
        for(let j=0;j<5;j++) {
          mat_made_form[i][j].hide();
        }
      }
      mat_made_form=[];
      no_of_rows.value(0);
      set.position(625,70);
      no_of_rows.removeAttribute("disabled");
      state=0;
    }
  })
  
  no_of_rows = createInput("0","number");
  no_of_rows.position(400,70);
}

function draw() {
  background(255);
  
  if(state==0) {
    add_raw_mat.show();
    add_made_mat.show();
    check_stock.show();
    set.hide();
    no_of_rows.hide();
  }else{
      add_raw_mat.hide();
      add_made_mat.hide();
      check_stock.hide();
  }

  if(state==1) {
    no_of_rows.show();
    set.show();
    text("Enter the number of Fabric to be Added",20,87.5);
  }

  if(state==2) {
    text("Enter the number of Fabric to be Added",20,87.5);
    text("Fabric",20,140);
    text("Lot Number",220,140);
    text("Colour Chart",420,140);
    text("Rate",620,140);
    text("Cut",820,140);
  }

  if(state==3) {
    no_of_rows.show();
    set.show();
    text("Enter the number of Fabric to be Added",20,87.5);
  }

  if(state==4) {
    text("Enter the number of Fabric to be Added",20,87.5);
    text("Lot Number",20,140);
    text("Design Number",220,140)
    text("Quantity",420,140);
    text("Job Rate",620,140);
    text("Packing Rate",820,140);
  }

  if(state==5) {
    loadLotNumbers();
    state=6;
  }

  if(state==6) {
    text("Fabric",20,100);
    text("L.N.",200,100);
    text("Quantity",300,100)
    text("Q.M.",400,100);
    text("Rate",500,100);
    text("Cut",600,100);
    text("Base Rate",700,100);
    text("Colour Chart",850,100);
    text("Design Number and Details",1200,100);

    for(let i=0;i<lot_numbers.length;i++) {
      text(lot_numbers[i][1],20,150+i*50);
      text(lot_numbers[i][0],200,150+i*50);
      text(lot_numbers[i][2],300,150+i*50);
      text(lot_numbers[i][3],400,150+i*50);
      text(lot_numbers[i][4],500,150+i*50);
      text(lot_numbers[i][5],600,150+i*50);
      text(lot_numbers[i][6],700,150+i*50);
      text(lot_numbers[i][7],850,150+i*50);
      for(let j=0;j<lot_numbers[i][8].length;j++) {
        text(lot_numbers[i][8][j],1200+100*j,150+i*50);
      }
    }
  }
}

function createForm() {
  let count = no_of_rows.value();
  raw_mat_form=[];
  for(let i=0;i<count;i++) {
    let arr=[];
    let fabric = createInput("0");
    let lot_number = createInput("0");
    let colour_chart = createInput("0");
    let rate = createInput("0","number");
    let cut = createInput("0","number");
    arr.push(fabric);
    arr.push(lot_number);
    arr.push(colour_chart);
    arr.push(rate);
    arr.push(cut);
    
    raw_mat_form.push(arr);
  }

  for(let i=0;i<count;i++) {
    for(let j=0;j<5;j++) {
      raw_mat_form[i][j].position(20+j*200,150+i*50);
    }
  }

  set.position(450,150+count*50);
}

function createForm_two() {
  let count = no_of_rows.value();
  mat_made_form=[];
  for(let i=0;i<count;i++) {
    let arr=[];
    let lot_number = createInput("0");
    let design_number = createInput("0");
    let quantity = createInput("0","number");
    let job_rate = createInput("0","number");
    let packing_rate = createInput("0","number");
    
    arr.push(lot_number);
    arr.push(design_number);
    arr.push(quantity);
    arr.push(job_rate);
    arr.push(packing_rate);
    
    mat_made_form.push(arr);
  }

  for(let i=0;i<count;i++) {
    for(let j=0;j<5;j++) {
      mat_made_form[i][j].position(20+j*200,150+i*50);
    }
  }

  set.position(450,150+count*50);
}

async function loadData(a) {
  let data = await database.ref("lot_numbers/"+mat_made_form[a][0].value() + "/quantity_made").once("value");

  return Number(data.val()) || 0;
}

async function loadLotNumbers() {

  let snapshot = await database.ref("lot_numbers").once("value");

  lot_numbers = [];

  snapshot.forEach((lot) => {

    let data = lot.val();

    let designs = [];

    if (data.design_numbers != null) {

      for (let design_number in data.design_numbers) {

        let design_data = data.design_numbers[design_number];

        designs.push([
          (design_number),
          (design_data[0]),
          (design_data[1]),
          (design_data[2])
        ]);

      }
    }

    lot_numbers.push([
      (lot.key),
      data.fabric,
      (data.quantity),
      (data.quantity_made),
      (data.rate),
      (data.cut),
      (data.base_rate),
      data.colour_chart,
      designs
    ]);
  });
}