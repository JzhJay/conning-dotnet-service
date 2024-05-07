class NotificationEmail extends React.Component {

    formatValue(value) {
        // Handle the case where c# incorrectly serializes an object as [object]
        if (value instanceof Array && value.length == 1 && value[0] instanceof Object)
            value = value[0];
        
        if (value instanceof Array)
            return value.join(", ");
        else if (value instanceof Object)
            return Object.keys(value).filter(k => value[k] != null).map(k => `${k}:${value[k]}`).join(", ");
        else if (value != null && !isNaN(value))
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
        else
            return value;
    }


    render() {
        const {banner, table, detail} = this.props;

        return <div style={{padding: 25, backgroundColor:"white", color: "#707070"}}>
            <div style={{height: 150, width: 1000, padding:"20px", backgroundColor:"#024990", color:"white", fontSize:30, display:"table-cell", textAlign:"center", verticalAlign:"middle"}}>{banner}</div>
            {detail && <div style={{fontSize: 16, padding:"20px 0px", color:"black"}}>{detail}</div>}
            {table && <div>
                <div style={{width: 1000, fontWeight: "bold", fontSize: 20, textAlign:"center", padding: 20, display:"table-cell"}}>{table.title}</div>
                <table>
                    <tbody style={{fontSize:16}}>
                    {table.entries.map(entry => <tr><td style={{fontWeight:"bold", paddingRight:20}}>{entry.title}</td><td>{this.formatValue(entry.value)}</td></tr>)}
                    </tbody>
                </table>
            </div>}
        </div>;

    }
} 