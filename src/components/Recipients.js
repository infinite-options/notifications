import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

export default class Recipients extends React.Component {
  constructor(props) {
    super(props);
    let columnDefs = [
      {field: '', headerCheckboxSelection: true, checkboxSelection: true,
       headerCheckboxSelectionFilteredOnly: true, width: 50},
      {headerName: 'Name', field: 'name'},
      {headerName: 'Email', field: 'email'},
      {headerName: 'Phone', field: 'phone'},
      {headerName: 'Zip Code', field: 'zipCode'},
      {headerName: '# Orders', field: 'n_orders'},
      {headerName: 'Created', field: 'first_order'},
      {headerName: 'Last Order', field: 'last_order'}
    ]
    columnDefs.forEach(colDef => {
      if (colDef.field) colDef.sortable = true
      colDef.suppressMovable = true
      colDef.filterParams = {
        buttons: ['apply', 'reset']
      }
      switch (colDef.field) {
        case '':
          break
        case 'n_orders':
          colDef.filter = 'agNumberColumnFilter'
          break
        case 'first_order':
        case 'last_order':
          colDef.filter = 'agDateColumnFilter'
          colDef.filterParams.comparator = function(filterDate, cellValue) {
            var dateParts = cellValue.split('-')
            var day = parseInt(dateParts[2])
            var month = parseInt(dateParts[1]) - 1
            var year = parseInt(dateParts[0])
            var cellDate = new Date(year, month, day)
            return cellDate.compareTo(filterDate)
          }
          break
        default:
          colDef.filter = true
      }
    })
    this.state = {
      columnDefs: columnDefs,
      rowData: [],
      height: window.innerWidth >= 900 ? window.innerHeight-32 : 500
    }
  }
  componentDidMount() {
    fetch(`${this.props.api}/all_orders`).then(res => res.json().then(data => {
      let rowData = [];
      data.Items.forEach(item => {
        rowData.push({
          name: item.name.S, email: item.email.S, phone: item.phone.S,
          zipCode: item.zipCode.N, n_orders: item.number_of_orders.S,
          first_order: item.created_at.S.slice(0, 10),
          last_order: item.last_order_date.S.slice(0, 10)
        })
      })
      rowData.forEach(row => {
        row.zipCode = parseInt(row.zipCode)
        row.n_orders = parseInt(row.n_orders)
      })
      this.setState({
        rowData: rowData
      })
    }))
  }
  render() {
    return (
      <div className='ag-theme-alpine' style={{'height': `${this.state.height}px`}}>
        <AgGridReact
          onGridReady={ params => this.gridApi = params.api }
          onSelectionChanged={this.props.updateValidity}
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}
          defaultColDef={{ resizable: true }}
          suppressSizeToFit={true}
          groupSelectsFiltered={true}
          groupUseEntireRow={true}
          rowSelection={'multiple'}>
        </AgGridReact>
      </div>
    );
  }
  resize = () => {
    this.setState({
      height: window.innerWidth >= 990 ? window.innerHeight-32 : 500
    })
  }
}
