//declare global variables
var mapimg ;
var issurl = "http://api.open-notify.org/iss-now.json";
var mapAPI = "https://api.mapbox.com/styles/v1/mapbox/";
var mapStyle = "satellite-streets-v9";
var mapSize = "/static/0,0,1,0,0/1024x512?access_token=";
var mapKey = "pk.eyJ1IjoidGhhbmh2aWUiLCJhIjoiY2l6bzJseWhmMDI3bDJxazd0b3Zvamk0eiJ9.O6edL33qfILaYegh41SEvw";

//(lon, lat) of center point of window
var clat = 0;
var clon = 0;

//(lon, lat) of ISS craft
var issX;
var issY;

//zoom level variables
var zoom = 1;

//variables for mapping with html elements
var lonvalue;
var latvalue;
var canvas;

var count = 0;

var cbxStyles;
var dmain;
function preload()
{
   mapimg = loadImage(mapAPI + mapStyle + mapSize + mapKey);
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
  //lon0 = lon;
  lon = radians(lon);
  var a = (256/PI)*pow(2,zoom);
  var b = lon + PI;
  return a*b;
}

//mapping latitude value to world mercator projection mapping
//fuction return new latitude value
function mercY(lat){
  //lat0 = lat;
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
  //canvas = select("#defaultCanvas0");
  //mapping lonvalue & latvalue variables with lonvalue & latvalue html elements accordingly
  lonvalue = select("#lonvalue");
  latvalue = select("#latvalue");

  cbxStyles = select("#mapStyle");
  //var btnRun = select("#btnRun");
  cbxStyles.changed(cbxEvent);
  dmain = select("#dmain");
  dmain.position(10,630);

  //run askISS function every 1 second
  setInterval(askISS,1000);
}

function cbxEvent(){
  mapStyle = cbxStyles.value();
  preload();
  console.log(mapStyle);
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
    stroke(255,0,255);
    fill(255);
  }

  function displayOff(){
    stroke(0);
    fill(0);
  }
