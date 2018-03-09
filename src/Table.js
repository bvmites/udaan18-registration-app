import React, {Component} from 'react';
import HotTable from 'react-handsontable';
import localforage from 'localforage';
import axios from 'axios';
import {Button, Col, Row} from 'react-materialize'
import './login.css'

import {branchNames, events, apiBaseUrl} from './data';

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
            message: '',
            submitBtnDisabled: false
        };
        this.handleDataChange = this.handleDataChange.bind(this);
        this.sendData = this.sendData.bind(this);
        this.clearData = this.clearData.bind(this);
        this.cleanupData = this.cleanupData.bind(this);
    }

    componentWillMount() {
        localforage.getItem(this.props.user.name)
            .then(data => data ? this.setState(() => ({tableData: cleanup(data)})) : null);
    }

    getData() {
        const filteredTableData = cleanup(this.state.tableData);
        return filteredTableData.map((row) => {
            const name = row.slice(6).filter(p => p && p.toString().trim().length !== 0);
            return {
                registrationDate: row[0] ? row[0].trim() : null,
                receiptNo: row[1] ? row[1].trim() : null,
                eventName: row[2] ? row[2].trim() : null,
                branch: row[3] ? row[3].trim() : null,
                year: row[4] ? row[4].trim() : null,
                phone: row[5] ? row[5].trim() : null,
                name: name.length === 1 ? name[0] : name
            };
        });
    }

    handleDataChange(data) {

        this.setState(() => ({
            error: '',
            message: ''
        }));

        localforage.setItem(this.props.user.name, data)
            .then(() => localforage.getItem(this.props.user.name))
            .then(data => this.setState(() => ({tableData: data})));
    }

    clearData() {
        localforage.setItem(this.props.user.name, null)
            .then(() => this.setState(
                () => ({tableData: [[]]})
            ));
    }

    cleanupData() {
        const data = cleanup(this.state.tableData);
        localforage.setItem(this.props.user.name, data)
            .then(() => this.setState(
                () => ({tableData: data})
            ));
    }

    sendData() {

        this.setState(() => ({
            submitBtnDisabled: true,
            error: '',
            message: ''
        }));

        const self = this;
        const apiUrl = apiBaseUrl + 'participants';
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
        console.log('HEADERS', headers);
        axios.post(apiUrl, payload, {headers})
            .then((response) => {

                this.setState(() => ({
                    submitBtnDisabled: false,
                    error: '',
                    message: ''
                }));

                if (response.status === 200) {
                    self.clearData();
                    self.setState(() => ({message: 'Data sent successfully.'}));
                }
            })
            .catch(error => {

                this.setState(() => ({
                    submitBtnDisabled: false
                }));

                const response = error.response;
                if (response.status === 404 || response.status === 405) {
                    const errors = response.data.invalid.map(p => +p + 1).join(',');
                    self.setState(() => ({error: `Error in row ${errors}`}));
                } else if (response.status === 401) {
                    self.setState(() => ({error: `Authentication error. Please login again.`}));
                } else if (response.status === 406) {
                    self.setState(() => ({error: `Cannot send empty input.`}));
                }
                else {
                    self.setState(() => ({error: `Internal server error.`}));
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
                                      defaultDate: new Date(),
                                      dateFormat: 'DD/MM/YYYY',
                                      correctFormat: true,
                                  },
                                  {},
                                  {
                                      type: 'autocomplete',
                                      source: eventNames,
                                      strict: true
                                  },
                                  {
                                      type: 'autocomplete',
                                      source: branchNames,
                                      strict: true
                                  },
                                  {
                                      type: 'autocomplete',
                                      source: ['1', '2', '3', '4'],
                                      strict: true
                                  },
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
                                  self.setState(() => ({
                                      message: '',
                                      error: ''
                                  }));
                                  // noinspection JSPotentiallyInvalidUsageOfClassThis
                                  self.handleDataChange(this.getData());
                              }
                          }}
                />
                <Row align="center" className="submitRow">
                    <Col s={2} align="left">
                        <Button id="sub"  disabled={this.state.submitBtnDisabled} onClick={this.sendData}>Send</Button>
                    </Col>
                    <Col s={2} align="left">
                        <Button id="clear" onClick={this.cleanupData}>Cleanup</Button>
                    </Col>
                </Row>
                <Row>
                    <Col s={4} offset="s4" align="center">
                        <div className="error">{this.state.error}</div>
                    </Col>
                    <Col s={4} offset="s4" align="center">
                        <div className="message">{this.state.message}</div>
                    </Col>
                </Row>
            </div>
        );
    }
}
