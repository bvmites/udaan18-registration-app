import React, {Component} from 'react';
import HotTable from 'react-handsontable';

import localForage from 'localforage';

localForage.config({
    name: 'udaan18-registration-app',
    version: 1.0,
    storename: 'table_data'
});

export default class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableData: [['', '', '', '', '', '', '', '', '']],
        };
        this.handleDataChange = this.handleDataChange.bind(this);

    }

    componentWillMount() {
        localForage.getItem('data')
            .then(data => data ? this.setState((state) => ({tableData: data})) : null);
    }

    cleanup(data) {
        const cleanupFilter = (row) => {
            if(!Array.isArray(row)) {
                return false;
            }
            let isRowDirty = true;
            for(let i = 0; i < row.length; i++) {
                const item = row[i];
                if(item) {
                    if(item.toString().trim().length !== 0) {
                        isRowDirty = false;
                        break;
                    }
                }
            }
            return isRowDirty;
        };

        if(!Array.isArray(data)) {
            console.error('Data is not an array.');
        }
        return data.filter(cleanupFilter);
    }


    getSpace = (e) => {
        console.log(">> e", e);
        let i;
        for (i = 0; i < e.length; i++) {
            // if(typeof e[i] === 'string') {
            //     e[i].trim();
            // }
            // if (e[i] === " " || e[i] === undefined || e[i] === null) {
            //     e = "-";
            // }
            // console.log(e[i]);
        }
        return e;
    };

    getData = () =>{
        console.log(this.state.tableData)
        const filteredTableData = this.cleanup(this.state.tableData);
        console.log(JSON.stringify(filteredTableData));
    };

    handleDataChange(data) {
        // console.log(data);
        localForage.setItem('data', data)
            .then(() => localForage.getItem('data'))
            .then(data => this.setState((state) => ({tableData: data})));
        console.log(this.state.tableData);
    }

    render() {
        const self = this;
        // console.log(this.state);
        return (
            <div>
                <div id="example-component">
                    <HotTable root="hot"
                              settings={{
                                  colHeaders: ['Event Name', 'Phone Number', 'Receipt Number', 'Participant1', 'Participant2x', 'Participant3', 'Participant4', 'Participant5', 'Participant6'],
                                  rowHeaders: true,
                                  minSpareRows: 1,
                                  stretchH: 'all',
                                  persistentState: true
                              }}
                              data={self.state.tableData}
                              afterChange={function (_, source) {
                                  if (source === 'edit')
                                      self.handleDataChange(this.getData());
                              }}
                    />
                </div>
                <button id="sub" onClick={this.getData}>Click</button>
            </div>
        );
    }
}