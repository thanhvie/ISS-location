//declare global variables
var mapimg ;
var issurl = "http://api.open-notify.org/iss-now.json";

var clat = 0;
var clon = 0;

var issX;
var issY;

var img;
var zoom = 1;

var lonvalue;
var latvalue;

var lon0;
var lat0;

var canvas;

var on = false;
var off = false;

var count = 0;

function preload()
{
  mapimg = loadImage("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/static/0,0,1,0,0/1024x512?access_token=pk.eyJ1IjoidGhhbmh2aWUiLCJhIjoiY2l6bzJseWhmMDI3bDJxazd0b3Zvamk0eiJ9.O6edL33qfILaYegh41SEvw");
  //mapimg = loadImage("https://api.mapbox.com/styles/v1/mapbox/light-v8/static/0,0,1,0,0/1024x512?access_token=pk.eyJ1IjoidGhhbmh2aWUiLCJhIjoiY2l6bzJseWhmMDI3bDJxazd0b3Zvamk0eiJ9.O6edL33qfILaYegh41SEvw");
}

function askISS()
{
  //load file JSON until done - then execute function getData
  loadJSON(issurl,getData,'jsonp');
}

function getData(data){
  //data variable contains json content after done loading

  //get (lon, lat) value of ISS craft
  var lon = data.iss_position.longitude;
  var lat = data.iss_position.latitude;

  //display (lon, lat) value on html p elements
  lonvalue.html("ISS longtitude: " + lon);
  latvalue.html("ISS latitude: " + lat);

  //convert (lon,lat) to mercator projection map
  issX = mercX(lon);
  issY = mercY(lat);
}

//mapping longtitude value to word mercator projection map
//function return new longtitude value
//reference this article : https://en.wikipedia.org/wiki/Mercator_projection
function mercX(lon){
  lon0 = lon;
  lon = radians(lon);
  var a = (256/PI)*pow(2,zoom);
  var b = lon + PI;
  return a*b;
}

//mapping latitude value to world mercator projection mapping
//fuction return new latitude value
function mercY(lat){
  lat0 = lat;
  lat = radians(lat);
  var a = (256/PI)*pow(2,zoom);
  var b = tan(PI/4 + lat/2);
  var c = PI - log(b);
  return a*c;
}

//setup function
function setup() {

  //create canvas
  canvas = createCanvas(1024,512);

  //mapping lonvalue & latvalue variables with lonvalue & latvalue html elements accordingly
  lonvalue = select("#lonvalue");
  latvalue = select("#latvalue");

  //run askISS function every 1 second
  setInterval(askISS,1000);
  setInterval(showISS,500);
}

//function draw - support to run at frequency of 60Hz
function draw(){
    count++;
    //translate the canvas (0,0) to the middle of the canvas
    translate(width/2, height/2);
    //change image mode to CENTER
    imageMode(CENTER);
    //set image center point at (0,0) position or at center of the canvas
    image(mapimg, 0, 0 );

    //get (lon,lat) value of center point on mercator map
    var cx = mercX(clon);
    var cy = mercY(clat);

    //console.log(cx);
    //console.log(cy);

    //if issY is true (exist), do the if statement
    if(issY)
    {
      //map(lon, lat) to mercator projection
      var x = issX - cx;
      var y = issY - cy;

      if(count < 30)
      {
        displayOn();
      }

      else if(count>30 && count<60)
      {
        displayOff();
      }

      else if (count >= 60){
        count = 0;
      }

      ellipse(x, y, 12, 12);
    }
  }

  function displayOn(){
    on = false;
    off = true;
    stroke(255,0,255);
    fill(255);
  }

  function displayOff(){
    on = true;
    off = false;
    stroke(0);
    fill(0);
  }

  function showISS(){
    if(on == true && off == false){
      displayOn();
    }else if(on == false && off == true){
      displayOff();
    }
  }
