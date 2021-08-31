import { useState } from '@hookstate/core'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TableContainer from '@material-ui/core/TableContainer'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import { useEffect } from 'react'

const States = ["Karnataka", "Gujrat", "Uttar Pradesh", "Maharashtra", "Delhi", "Jammu Kashmir"]

const useStyles = makeStyles({
    formContainer: {
        padding: 15,
        maxWidth: 600,
    },
    row: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
})

function App () {
    const appState = useState({
        companyLogo: null,
        invoiceNumber: null,
        addresses: {
            from: {
                line1: '',
                line2: '',
                state: '',
            },
            to: {
                line1: '',
                line2: '',
                state: '',
            },
        },
        invoiceDate: null,
        dueDate: null,
        items: [],
    })
    const dialog = useState({
        open: false,
        data: {
            itemName: null,
            quantity: null,
            rate: null,
            amount: null,
        },
    })
    const tax = useState(0)
    const subTotal = useState(0)
    const itemCount = useState(0)
    const dates = useState({
        invoiceDate: '2021-08-31',
        dueDate: '2021-08-31'
    })
    const classes = useStyles()

    const addItem = () => {
        dialog.open.set(false)
        appState.items.set(prev => [...prev, {
            id: prev.length + 1,
            itemName: dialog.data.itemName.get(),
            quantity: Number(dialog.data.quantity.get()),
            rate: Number(dialog.data.rate.get()),
            amount: Number(dialog.data.amount.get()),
        }])
        dialog.data.set({
            itemName: null,
            quantity: null,
            rate: null,
            amount: null,
        })
        itemCount.set(prev => prev + 1)
    }
    const deleteItem = id => {
        appState.items.set(prev => prev.filter(item => item.id !== id))
        itemCount.set(prev => prev - 1)
    }
    const convertAndSaveFile = file => {
        const reader = new FileReader()
        reader.addEventListener("load", () => {
            appState.companyLogo.set(reader.result)
        }, false)
        reader.readAsDataURL(file)
    }

    useEffect(() => {
        subTotal.set(appState.items.get().map(item => item.amount).reduce((prev, next) => prev + next, 0))
    }, [itemCount.get()])

    return <center>
        <Paper elevation={24} className={classes.formContainer}>
            <div className={classes.row}>
                <div>
                    <input
                        accept="image/*"
                        id="contained-button-file"
                        type="file"
                        onChange={event => convertAndSaveFile(event.target.files[0])}
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" color="primary" component="span">
                            Upload
                        </Button>
                    </label>
                    <br /><br />
                    <img src={appState.companyLogo.get()} style={{ width: 200, height: 'auto' }} />
                </div>
                <TextField
                    style={{ minWidth: 200 }}
                    variant="outlined"
                    label="Invoice Number"
                    value={appState.invoiceNumber.get()}
                    onChange={event => appState.invoiceNumber.set(event.target.value)} />
            </div>
            <br /><br />
            <div className={classes.row}>
                <div>
                    <Typography variant="button">From : </Typography>
                    <br /><br />
                    <TextField
                        style={{ minWidth: 250 }}
                        variant="outlined"
                        label="Address Line 1"
                        value={appState.addresses.from.line1.get()}
                        onChange={event => appState.addresses.from.line1.set(event.target.value)} />
                    <br /><br />
                    <TextField
                        style={{ minWidth: 250 }}
                        variant="outlined"
                        label="Address Line 2"
                        value={appState.addresses.from.line2.get()}
                        onChange={event => appState.addresses.from.line2.set(event.target.value)} />
                    <br /><br />
                    <FormControl variant="outlined" style={{ minWidth: 250 }}>
                        <InputLabel id="state-label">State</InputLabel>
                        <Select
                            label="State"
                            labelId="state-label"
                            value={appState.addresses.from.state.get()}
                            onChange={event => appState.addresses.from.state.set(event.target.value)} >
                            {
                                States.map((item, index) =>
                                    <MenuItem key={index} value={item}>{item}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <Typography variant="button">To : </Typography>
                    <br /><br />
                    <TextField
                        style={{ minWidth: 250 }}
                        variant="outlined"
                        label="Address Line 1"
                        value={appState.addresses.to.line1.get()}
                        onChange={event => appState.addresses.to.line1.set(event.target.value)} />
                    <br /><br />
                    <TextField
                        style={{ minWidth: 250 }}
                        variant="outlined"
                        label="Address Line 2"
                        value={appState.addresses.to.line2.get()}
                        onChange={event => appState.addresses.to.line2.set(event.target.value)} />
                    <br /><br />
                    <FormControl variant="outlined" style={{ minWidth: 250 }}>
                        <InputLabel id="state-label">State</InputLabel>
                        <Select
                            label="State"
                            labelId="state-label"
                            value={appState.addresses.to.state.get()}
                            onChange={event => appState.addresses.to.state.set(event.target.value)} >
                            {
                                States.map((item, index) =>
                                    <MenuItem key={index} value={item}>{item}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </div>
            </div>
            <br />
            <div className={classes.row}>
                <TextField
                    style={{ minWidth: 250 }}
                    variant="outlined"
                    label="Invoice Date"
                    type="date"
                    defaultValue={dates.invoiceDate.get()}
                    onChange={event => dates.invoiceDate.set(event.target.value)} />
                <TextField
                    style={{ minWidth: 250 }}
                    variant="outlined"
                    label="Due Date"
                    type="date"
                    defaultValue={dates.dueDate.get()}
                    onChange={event => dates.dueDate.set(event.target.value)} />
            </div>
            <br />
            <TableContainer component={Paper}>
                <Table style={{ width: '100%' }}>
                    <TableHead style={{ backgroundColor: '#EEEEEE' }}>
                        {
                            ['Sl. No.', 'Item Name', 'Quantity', 'Rate', 'Amount'].map((item, index) =>
                                <TableCell align="center" style={{ fontWeight: 'bold' }} key={index}>{item}</TableCell>)
                        }
                        <TableCell align="center">&nbsp;</TableCell>
                    </TableHead>
                    <TableBody>
                        {
                            appState.items.get().map((item, index) =>
                                <TableRow key={index}>
                                    {
                                        [index + 1, item.itemName, item.quantity, item.rate, item.amount].map((i, idx) =>
                                            <TableCell align="center" key={idx}>{i}</TableCell>)
                                    }
                                    <TableCell align="center">
                                        <IconButton onClick={() => deleteItem(item.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>)
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <br />
            <Button
                variant="contained"
                color="primary"
                onClick={() => dialog.open.set(true)} >Add Item</Button>
            <br /><br /><br />
            <br />
            <Typography>Sub Total : {subTotal.get()}</Typography>
            <br /><br />
            <TextField
                variant="outlined"
                label="Tax in %"
                value={tax.get()}
                onChange={event => tax.set(Number(event.target.value))} />
            <br /><br />
            <Typography>Total : {subTotal.get() + ((tax.get() / 100) * subTotal.get())}</Typography>
        </Paper>
        <Dialog maxWidth="sm" fullWidth onClose={e => e.preventDefault()} open={dialog.open.get()}>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogContent>
                <div className={classes.row}>
                    <TextField
                        variant="outlined"
                        label="Item Name"
                        value={dialog.data.itemName.get()}
                        onChange={event => dialog.data.itemName.set(event.target.value)} />
                    <TextField
                        variant="outlined"
                        label="Quantity"
                        value={dialog.data.quantity.get()}
                        onChange={event => dialog.data.quantity.set(event.target.value)} />
                </div>
                <br />
                <div className={classes.row}>
                    <TextField
                        variant="outlined"
                        label="Rate"
                        value={dialog.data.rate.get()}
                        onChange={event => dialog.data.rate.set(event.target.value)} />
                    <TextField
                        variant="outlined"
                        label="Amount"
                        value={dialog.data.amount.get()}
                        onChange={event => dialog.data.amount.set(event.target.value)} />
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => dialog.open.set(false)}>Close</Button>
                <Button variant="contained" color="primary" onClick={() => addItem()}>Add</Button>
            </DialogActions>
        </Dialog>
    </center>
}

export default App;