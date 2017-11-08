$(document).ready(() => {
  const schedule = new Schedule()

  schedule.main()
})

class Schedule {

  constructor() {
    this._active = 0
    this.timestamp = new Date()
    this._serverTimestamp = new Date()
    this.createSchedule()

  }
  simulateUpdate() {
    this._active = (this._active + 1) % 12;
    this._serverTimestamp = new Date()
  }
  async talkToServer() {
    if (this.timestamp == this._serverTimestamp) {
      return {
        new: false
      }
    }

    this.timestamp = this._serverTimestamp

    return Promise.resolve({
      new: true,
      events: [
        { id: 0, label: 'Registration', time: 9 },
        { id: 1, label: 'Breakfast', time: 9.5 },
        { id: 2, label: 'Opening Ceremony', time: 10.5 },
        { id: 3, label: 'Hacking Starts', time: 12 },
        { id: 4, label: 'Team Forming Session', time: 12 },
        { id: 5, label: 'Workshop: American Express', time: 13 },
        { id: 6, label: 'Lunch', time: 14 },
        { id: 7, label: 'Workshop: Web Applications UK', time: 15 },
        { id: 8, label: 'Workshop: Ocado', time: 16.5 },
        { id: 9, label: 'Workshop: Auto Trader UK', time: 18 },
        { id: 10, label: 'Dinner', time: 18.5 },
        { id: 11, label: 'Workshop: Goldman Sachs', time: 19.5 },
      ],
      active: this._active
    })
  }

  async pingServer() {
    const apiUrl = ``

    const data = await this.talkToServer()

    if (data.new)
      await this.updateSchedule(data)
  }

  createSchedule() {
    var container = document.getElementById('mynetwork');

    // provide the data in the vis format
    var visData = {
      nodes: [],
      edges: []
    };
    var options = {
      nodes: {
        font: {
          size: 14,
          color: "#ffffff"
        },
        size: 40,
      },
      interaction: {
        dragView: false,
        dragNodes: false,
        multiselect: false,
        zoomView: false
      }
    };
    

    this.network = new vis.Network(container, visData, options);
  }
  async updateSchedule(data) {

    const eventImage = "images/guh_honeycomb.png"
    const beeImage = "images/guh_logo.png"
    const nodeOptions = {
      shape: 'image',
      allowedToMoveX: false,
      allowedToMoveY: false
    }

    const eventOptions = { image: eventImage, ...nodeOptions }
    const activeEventOptions = { image: beeImage, ...nodeOptions }

    const cols = 4;

    const nodes = new vis.DataSet(
      data.events.map((event, index) => {
        const inheritOptions = (data.active === event.id ? activeEventOptions : eventOptions)
        return {
          id: index,
          label: event.label,
          ...inheritOptions,
          x: Math.floor(index % cols) * 150,
          y: Math.floor(index / cols) * 200,
          fixed: true,
        }
      })
    )

    // create an array with edges
    var edges = new vis.DataSet(
      data.events.map((event, index) => {
        if (index < data.events.length)
          return {
            from: index,
            to: index + 1,
            smooth: true,

          }
      })
    );

    this.network.setData({nodes, edges})

  }
  async main() {

    await this.pingServer()

    setInterval(this.pingServer.bind(this), 500)
    setInterval(this.simulateUpdate.bind(this), 2000)
  }
}