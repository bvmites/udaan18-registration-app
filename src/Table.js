import React, {Component} from 'react';
import HotTable from 'react-handsontable';
import localforage from 'localforage';
import axios from 'axios';

import config from './config';

const events = config.events;
const eventNames = events.map(e => e.eventName);

const cleanup = (data) => {
    const cleanupFilter = (row) => {
        if (!Array.isArray(row)) {
            return false;
        }
        let isRowDirty = true;
        for (let i = 0; i < row.length; i++) {
            const item = row[i];
            if (item && item.toString().trim().length !== 0) {
                isRowDirty = false;
                break;
            }
        }
        return !isRowDirty;
    };

    if (!Array.isArray(data)) {
        console.error('Data is not an array.');
    }
    return data.filter(cleanupFilter);
};

localforage.config({
    name: 'udaan18-registration-app',
    version: 1.0,
    storename: 'table_data'
});

export default class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableData: [[]],
            error: '',
            message: ''
        };
        this.handleDataChange = this.handleDataChange.bind(this);
        this.sendData = this.sendData.bind(this);
        this.clearData = this.clearData.bind(this);
    }

    componentWillMount() {
        localforage.getItem(this.props.user.name)
            .then(data => data ? this.setState((state) => ({tableData: cleanup(data)})) : null);
    }

    getData() {
        const filteredTableData = cleanup(this.state.tableData);
        return filteredTableData.map((row) => {
            const name = row.slice(6).filter(p => p && p.toString().trim().length !== 0);
            return {
                registrationDate: row[0].trim(),
                receiptNo: row[1].trim(),
                eventName: row[2].trim(),
                branch: row[3].trim(),
                year: row[4].trim(),
                phone: row[5].trim(),
                name: name.length === 1 ? name[0] : name
            };
        });
    }

    handleDataChange(data) {
        localforage.setItem(this.props.user.name, data)
            .then(() => localforage.getItem(this.props.user.name))
            .then(data => this.setState((state) => ({tableData: data})));
    }

    clearData() {
        localforage.setItem(this.props.user.name, null)
            .then(() => this.setState(
                (state) => ({tableData: [[]]})
            ));
    }

    sendData() {
        const self = this;
        const apiUrl = 'http://udaan18-participants-api.herokuapp.com/participants';
        const data = this.getData();
        const payload = data.map(p => {
            const event = events.find(e => e.eventName === p.eventName);
            return {...p, eventId: event ? event._id : null}
        });
        console.log('PAYLOAD', payload);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': this.props.user.token
        };
        axios.post(apiUrl, payload, headers)
            .then((response) => {
                if (response.status === 200) {
                    self.clearData();
                    self.setState(() => ({message: 'Data sent successfully.'}));
                }
            })
            .catch(error => {
                const response = error.response;
                if (response.status === 404 || response.status === 405) {
                    const errors = response.data.invalid.map(p => +p + 1).join(',');
                    self.setState((state) => ({error: `Error in rows ${errors}`}));
                } else {
                    self.setState((state) => ({error: `Internal server error.`}));
                }
            })
    }

    render() {
        const self = this;
        return (
            <div>
                <HotTable root="hot"
                          settings={{
                              colHeaders: [
                                  'Date',
                                  'Receipt No.',
                                  'Event Name',
                                  'Branch',
                                  'Year',
                                  'Contact No.',
                                  'Participant1',
                                  'Participant2',
                                  'Participant3',
                                  'Participant4',
                                  'Participant5',
                                  'Participant6'
                              ],
                              columns: [
                                  {
                                      type: 'date',
                                      defaultDate: new Date()
                                  },
                                  {},
                                  {
                                      type: 'autocomplete',
                                      source: eventNames,
                                      strict: true
                                  },
                                  {},
                                  {},
                                  {},
                                  {},
                                  {},
                                  {},
                                  {},
                                  {},
                                  {}
                              ],
                              rowHeaders: true,
                              minSpareRows: 1,
                              stretchH: 'all'
                          }}
                          data={this.state.tableData}
                          afterChange={function (_, source) {
                              if (source === 'edit') {
                                  self.handleDataChange(this.getData());
                              }
                          }}
                />
                <button id="sub" onClick={this.sendData}>Send</button>
                <button id="clear">Cleanup</button>
                <div>{this.state.error}</div>
                <div>{this.state.message}</div>
            </div>
        );
    }
}