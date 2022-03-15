class SushiTableSetup {
  
  constructor(initialTableCapacity = 12) {
    this.submitBtn = document.getElementById('submitBtn');
    this.numOfChairsInput = document.getElementById('numOfChairsInput');
    this.showIndicesBtn = document.getElementById('showIndicesBtn');
    this.tableCapacity = initialTableCapacity;
    this.radius = 160;
    this.table = document.getElementById('table');
    this.offsetToTable = parseInt(this.table.offsetWidth / 2);
    this.offsetToChairCenter = 20;
    this.totalOffset = this.offsetToTable - this.offsetToChairCenter;

    this.arrivingGuestsInput = document.getElementById('arrivingGuestsInput');
    this.arrivingGuestsSubmitBtn = document.getElementById('arrivingGuestsSubmitBtn');
    this.message = document.getElementById('message');
    this.chairs = [...document.querySelectorAll('.chair')];
    // events
    this.submitBtn.addEventListener('click', () => this.setTableCapacity());
    this.arrivingGuestsSubmitBtn.addEventListener('click', () => {
      this.setArrivingGuests();
    });
    this.arrivingGuestsInput.addEventListener('keydown', (e) => {
      if(e.key == 'Enter') {
        this.setArrivingGuests();
      }
    })
    this.numOfChairsInput.addEventListener('keydown', (e) => {
      if(e.key === 'Enter') {
        this.setTableCapacity();
      }
    })
  }

  setEvents() {
    let chairs = [...document.querySelectorAll('.chair')];
    chairs.forEach(item => {
      item.addEventListener('click', (e) => this.removeGroups(e));
    })

    this.showIndicesBtn.addEventListener('click', () => {
      chairs.forEach(chair => chair.childNodes[0].classList.toggle('hide'));
    });
  }
  
  setTableCapacity() {
    // pass in table capacity to createChairs method
    const totalChairs = parseInt(this.numOfChairsInput.value);
    if(totalChairs > 20) {
      this.message.innerHTML = '<h2>Leider ist nicht genug Platz für so viele Stühle 🤨. Bitte gib eine Zahl zwischen 2 und 20 ein.</h2>';
      return;
    } else if(!totalChairs || totalChairs < 2) {
      this.message.innerHTML = '<h2>Bitte gib mindestens 2 Stühle ein.</h2>';
     return;
    }
    this.message.innerHTML = '';
    this.createChairs(totalChairs);
  }
  
  createChairs(tableCapacity) {
    // If table capacity has been previously set, delete all child nodes
    if(this.table.hasChildNodes()) {
      this.table.innerHTML = '';
    }
    this.tableCapacity = parseInt(tableCapacity) || this.tableCapacity;

    this.spread = 360 / this.tableCapacity;

    for (let i = 1; i <= this.tableCapacity; i++) {
      const chair = document.createElement('div');
      const indexDisplay = document.createElement('span');
      const y = Math.sin((this.spread * i) * (Math.PI / 180)) * this.radius;
      const x = Math.cos((this.spread * i) * (Math.PI / 180)) * this.radius;
      indexDisplay.innerText = i -1;
      indexDisplay.classList.add('hide');
      chair.className = 'chair';
      chair.style.position = 'absolute';
      chair.style.top = (y + this.totalOffset).toString() + "px";
      chair.style.left = (x + this.totalOffset).toString() + "px";
      chair.appendChild(indexDisplay);
      this.table.appendChild(chair);
    }
    this.setEvents();
  }

  removeGroups(e) {
    if(e.target.classList.contains('booked')) {
      const removeGroupBtn = document.getElementById('removeGroupBtn');
      let group = [...document.querySelectorAll(`[data-id='${e.target.dataset.id}']`)];

      group.forEach(guest => {
        guest.classList.toggle('remove');
      });

      removeGroupBtn.addEventListener('click', () => {
        group.forEach(guest => {
          if(guest.dataset.id === e.target.dataset.id && guest.classList.contains('remove')) {
            guest.classList.remove('booked');
            guest.classList.remove('remove');
            this.message.innerHTML = '<h2>Nun ist wieder mehr Platz frei geworden.</h2>';
            this.arrivingGuestsInput.value = '';
            this.arrivingGuestsInput.focus();
          }
        })
      })
      removeGroupBtn.focus();
    } 
  }

  // returns true if all seats are free
  tableIsEmpty(chairs) {
    return chairs.every(chair => !chair.classList.contains('booked'));
  }

  // returns true if all seats are taken
  isFullyBooked(chairs) {
    return chairs.every(chair => chair.classList.contains('booked'));
  }
  
  // returns an array of string values: booked || free
  isBooked(chairs) {
    return chairs.map(item => item.classList.contains('booked') ? 'booked' : 'free');
  }
  
  // Set Arriving Guests
  setArrivingGuests() {
    
    const chairs = [...document.querySelectorAll('.chair')];
    const numOfGuests = parseInt(this.arrivingGuestsInput.value);
    // Check user's input value and display message if necessary
    if(!numOfGuests) {
      this.message.innerHTML = '<h2>Bitte gib die Anzahl der ankommenden Gäste ein.</h2>';
      return;
    } else if(numOfGuests > chairs.length) {
      this.message.innerHTML = '<h2>Leider ist der Tisch nicht groß genug für diese Gruppe.</h2>';
      return;
    } else {
      this.message.innerHTML = '';
    }

    // If table is empty add first guests and return
    if(this.tableIsEmpty(chairs)) {
      let groupId = Math.random();
      for(let i = 0; i < this.arrivingGuestsInput.value; i++) {
        chairs[i].classList.add('booked');
        chairs[i].setAttribute('data-id', groupId);
      }
      return;
    }

    // Return early if table capacity is full
    if(this.isFullyBooked(chairs)) {
      this.message.innerHTML = '<h2>Leider ist der Tisch vollständig ausgebucht.</h2>';
      return;
    }
    
    let freeSeatsArray = [];
    let indexFreeSeatsArray = []; 
    let freeSeats = 0;
    let startingIndex = null;

    // loop through array of string values: booked or free
    this.isBooked(chairs).forEach((item, index) => {

      if(item === 'free') {
        // seat is free, add 1 to freeSeats count
        freeSeats +=1;
        
        // set startingIndex to the index of the first free seat only
        if(startingIndex === null) {
           startingIndex = index;
        } 
         
      } else {
        // only push free seats to freeSeatsArray
        if(freeSeats) {
          freeSeatsArray.push(freeSeats);
          indexFreeSeatsArray.push(startingIndex);
          // reset startingIndex and freeSeats count
          freeSeats = 0;
          startingIndex = null;
        }   
      }
    });
    // need final push - no booked seat to trigger push
    if(freeSeats) {
      freeSeatsArray.push(freeSeats);
      indexFreeSeatsArray.push(startingIndex);
    }
    
    // Check if seats at first and last indices are free
    if(!chairs[0].classList.contains('booked') && !chairs[chairs.length - 1].classList.contains('booked')) {
      // remove index 0 from indexFreeSeatsArray
      indexFreeSeatsArray.shift();
      // get sum of free seats at first and last indices 
      freeSeatsArray = freeSeatsArray.map((item, i, arr) => {
        if(i === arr.length -1) {
          return arr[0] + arr[arr.length - 1];
        } else {
          return item;
        }
      });
      // remove free seats from the beginning of the freeSeatsArray - these were added to the end
      freeSeatsArray.shift();
    }

    for(let i = 0; i < freeSeatsArray.length; i++) {

      let groupId = Math.random();
      let count = 0;

      if(freeSeatsArray.every(item => item < parseInt(this.arrivingGuestsInput.value))) {
        this.message.innerHTML = '<h2>Es gibt nicht genug Platz für diese Gäste – leider müssen sie die Bar hungrig verlassen.</h2>';
        break;
      }
     
      if(parseInt(this.arrivingGuestsInput.value) > freeSeatsArray[i]) {
        continue;
      } 

      let bestMatch = freeSeatsArray.map(item => item / this.arrivingGuestsInput.value);

      let result = Math.min(...bestMatch.filter(item => {
        return item >= 1;
      }))


      for(let j = 0; j< this.arrivingGuestsInput.value; j++ ) {
        
        let placement = indexFreeSeatsArray[bestMatch.indexOf(result)] + j;

        if(placement >= chairs.length) {
          placement = count;
          count++
        } 

        chairs[placement].classList.add('booked');
        chairs[placement].setAttribute('data-id', groupId);
      }
      
    }  
  } // Set Arriving Guests method END
  
}

const sushiTable = new SushiTableSetup();
sushiTable.createChairs();