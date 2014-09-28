// Jason Olander, Foundations 1, 9/14

// Assignment 04
// Upgrade race with jquery, html, css

// JQuery start up
$(function() {

  //
  // Declarations and Objects
  //
  var animals = []; // Animals array                             
  var tracks =[];   // Tracks array
  var raceTrack;    // Hold track object
  
  // Set up animal objects
  var rabbit = new Animal('Fluffy the Rabbit', 80, 5, './img/rabbit.jpg');
  var turtle = new Animal('Horatio the Turtle', 30, 9, './img/turtle.jpg');   
  var pig = new Animal('Wilbur the Pig', 50, 5, './img/pig.jpg');

  //
  // Constructors
  //

  // Animal constructor
  function Animal(name, speed, focus, image){
    this.name = name;
    this.speed = speed;
    this.focus = focus;
    this.image = image;
    this.position = 0;
    animals.push(this); // add object to animals array
    this.isFocused = function(){
      return (GetRandomInt(5) + raceTrack.distraction) < this.focus;
    }
    this.advance = function(){
      if (this.isFocused()) {
        this.position += this.speed;
        this.isDistracted = false;
      }
      else{
        this.isDistracted = true;
      }
    }
    this.getPosition = function(){
      return this.position;
    }
    this.progressReport = function(){
      if (this.isDistracted) {
        return this.name + " is distracted!";  
      }
      else{
        return this.name + " has completed " + this.position + " meters of " + raceTrack.distance;
      }
    }
  }

  // Track constructor
  function Track(name, distance, distraction,image){
    this.name =name;
    this.distance = distance;
    this.distraction = distraction;
    this.image = image;
    tracks.push(this); // add object to tracks array
    this.currentPosition = function(position){
      return this.distance / position;
    }
  }  
  // Set up track objects
  var meadow = new Track('Tranquil Meadow', 800, 1, './img/meadow.jpg');
  var forest = new Track('Dense Forest', 800, 3, './img/forest.jpg');
  var desert = new Track('Bleak Desert', 800, 2, './img/desert.jpg');
  
  //
  // Page setup
  //

  // Build the animal list
  for (var i = 0; i < animals.length; i++) {

    str = "<li id='" + i +"' class='animal'>" + animals[i].name + "</li>";
    $('ul.critters').append(str);
  }

  // Build the track list
  for (var i = 0; i < tracks.length; i++) {

    str = "<li id='" + i +"' class='track'>" + tracks[i].name + "</li>";
    $('ul.tracks').append(str);    
  }

  // 
  // Event Handlers
  //

  // Animal has has been clicked. Check and selection display status, add or remove to racers list
  $('li.animal').on('click', function() {

    myID = this.id;                         // Get id from clicked item
    
    if ( $(this).hasClass('selected') ){    // Check if already selected and in racer list

      $('li#' + myID + '.racer').remove();  // Remove racer from list
      $(this).removeClass('selected');      // Set element to not selected
    }
    else {
      
      str = "<li id='" + myID + "' class='racer'><img src=" + animals[myID].image + "></li>"; // Build list item string with image ref
      
      if( $('li.racer').length > 1 ){   // If the racer list already has two racers
        
        myID = $('li.racer:last').attr('id');                 // Get id attribute from last racer in list
        $('li#' + myID + '.animal').removeClass('selected');  // Set matching animal list element to not selected
        $('li.racer:last').remove();                          // Remove last racer from list and replace with new selection
      }

      $('ul.race').append(str);       // Add new racer list item to race element
      $(this).addClass('selected');   // Set new css class
      
    }

    checkRaceNow();   // Are we ready to race?
  })
  
  // Track has has been clicked. Check and selection display status, add or remove to race
  $('li.track').on('click', function() {
    
    myID = this.id;  // Get id from clicked item
    
    if ( $(this).hasClass('selected') ){  // If already selected, remove and reset
      
      $(this).removeClass('selected');
      
      $('ul.race').css({  // Reset background image
        'background-image' : 'url(./img/racetrack.jpg)'
      })

    }
    else{ 
      
      $('li.track').removeClass('selected');  // Reset all track list items
      
      raceTrack = tracks[myID];               // Set race track
      
      $(this).addClass('selected');             // Set new css class
      
      img = 'url(' + tracks[myID].image + ')';  // Get new background image for race element
      $('ul.race').css({
        'background-image' : img
      })
    }
    checkRaceNow();   // Are we ready to race?
  })

  // Race Now button is enabled and clicked
  $('#btnrace').on('click', function() {
    
    if( $('#btnrace').hasClass('reset') ){
      ResetRace();
    }
    else{
      idOne = $('li.racer:eq(0)').attr('id');   // Get seleted animal IDs
      idTwo = $('li.racer:eq(1)').attr('id');
      runRace(idOne, idTwo);  // Start race    
    }
  })

  // 
  // Functions
  //
  
  // Utility
  function GetRandomInt(uBound){
    return Math.floor(Math.random() * (uBound + 1));
  }

  // Enable/disable "Race Now" button
  function checkRaceNow(){

    count = $('li.racer').length;           // How many racers selected
    
    if ( raceTrack && (count > 1) ){        // If there are two racers and one track selected

      $('#btnrace').prop('disabled', false);  // Enable button   
    }
    else{

      $('#btnrace').prop('disabled', true);   // Missing racers or track, disable button
    }
  }
 
  // Run the race, with progress reports displayed
  function runRace(idOne, idTwo){

    r1 = animals[idOne];  // Local reference for racer one
    r2 = animals[idTwo];  // Local reference for for racer two

    str = r1.name + ' versus ' + r2.name + ' in the ' + raceTrack.name; // Build status string
    $('#status').text(str); // Set status string

    r1.advance(); // Advance racers
    r2.advance();

    // Build and display progress strings
    str = r1.progressReport() + " | " + r2.progressReport()
    $('p.progress').text(str);
    console.log(str);

    // Update image positions
    $('li.racer').each( function() {

      myID = this.id;
      pos = animals[myID].getPosition();
      
      $(this).animate({
        paddingLeft: pos + 'px'
      },250);
    })

    // Check if either racer has reached track end
    if (r1.position < raceTrack.distance && r2.position < raceTrack.distance){
      setTimeout(function(){runRace(idOne, idTwo)}, 500); // No winner, run another leg of race after delay
    }
    else{
      // Declare a winner
      if (r1.position > r2.position){

        message = r1.name;
      }
      else{
        message = r2.name;
      }

      // Display the winner
      str = message + " is victorious!!"
      $('p.progress').text(str);

      $('#btnrace').text('Reset Race');
      $('#btnrace').addClass('reset');
    }
  }

  // Reset the race 
  function ResetRace(){
    
    $('li.animal').removeClass('selected');
    $('li.track').removeClass('selected');
    $('li.racer').remove();
    $('#btnrace').prop('disabled', true);
    $('#btnrace').text('Race Now!');
    $('#btnrace').removeClass('reset');
    $('#status').text('Waiting To Race...');
    $('p.progress').text('');
    raceTrack = '';  
    $('ul.race').css({  // Reset background image
        'background-image' : 'url(./img/racetrack.jpg)'
    })

    for (var i = 0; i < animals.length; i++) {
      animals[i].position = 0;
    };

  }

})