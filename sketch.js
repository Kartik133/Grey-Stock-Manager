var database;
var add_raw_mat,add_made_mat,check_stock,no_of_rows,set;
var state=0;
var raw_mat_form=[];

function setup() {
  createCanvas(displayWidth,displayHeight);

  database = firebase.database();
  
  // database.ref("cutCount").on("value",(data)=> {
  //   cutCount = data.val();
  // });

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
    state=4;
  })

  set = createButton("Set");
  set.position(525,70);
  
  no_of_rows = createInput("0","number");
  no_of_rows.position(325,70);
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
    text("Enter the of Fabric to be Added",20,87.5);
    set.mouseReleased(()=>{
      no_of_rows.attribute("disabled",""); 
      createForm();
      state=2;
    })
  }

  if(state==2) {
    text("Enter the of Fabric to be Added",20,87.5);
    text("Fabric",20,140);
    text("Lot Number",220,140);
    text("Colour Chart",420,140);
    text("Rate",620,140);
    text("Cut",820,140);
    set.mouseReleased(()=>{
      for(let i=0;i<no_of_rows.value();i++) {
        let quantity = raw_mat_form[i][2].value().split(",").map(Number).reduce((sum, value) => sum + value, 0);
        database.ref(raw_mat_form[i][1].value()).set({
          fabric:raw_mat_form[i][0].value(),
          colour_chart:raw_mat_form[i][2].value(),
          rate:raw_mat_form[i][3].value(),
          cut:raw_mat_form[i][4].value(),
          quantity:quantity,
          base_rate:quantity*raw_mat_form[i][3].value()
        });
      }
      raw_mat_form=[];
      no_of_rows.value(0);
      set.position(525,70);
      state=0;
    })
  }

  if(state==3) {

  }

  if(state==4) {

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
    // fabric.hide();
    // lot_number.hide();
    // colour_chart.hide();
    // rate.hide();
    // cut.hide();
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

function createTextboxes() {

}