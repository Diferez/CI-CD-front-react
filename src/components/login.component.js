import axios from "axios";
import React, { Component, useState, useEffect, useRef } from "react";
import MaterialTable from "material-table";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { GoogleLogin } from 'react-google-login';
import { Icon } from 'leaflet'




const Login = (props) => {
    const tableRef = useRef();
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [panelmascotas, setPanelmascotas] = useState(false);
    const [mascotasList, setMascotasList] = useState([]);
    const [mascotasListMap, setMascotasListMap] = useState([]);
    const [addMascotas, setAddmascotas] = useState(false);
    const [editMascotas, setEditmascotas] = useState(false);

    const [mascotaTemp, setMascotaTemp] = useState({
        "adoptado": false,
        "vacunado": false,
    });

    const [mascotaEdit, setMascotaEdit] = useState({
        "id": "",
        "nombre": "",
        "raza": "",
        "tipo": "",
        "adoptado": "",
        "vacunado": "",
        "ubicacion": "",
    });

    const columns = [
        {
            title: "Id",
            field: "id"
        },
        {
            title: "Nombre",
            field: "nombre"
        },
        {
            title: "Raza",
            field: "raza"
        },
        {
            title: "Tipo",
            field: "tipo"
        },
        {
            title: "Adoptado",
            field: "adoptado"
        },
        {
            title: "Vacunado",
            field: "vacunado"
        },
        {
            title: "Ubicacion",
            field: "ubicacion"
        }
    ]
    const auth = () => {
        const usuario = {
            nombre: user,
            password: password
        }
        axios.post('http://localhost:8080/login/', usuario)
            .then(response => {
                console.log(response);
                if (response.data.login) {
                    setAuthenticated(true);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    const loadMascotas = () => {
        axios.get('http://localhost:8080/mascotas/')
            .then(response => {
                setMascotasList(response.data.mascota);
            })
    }


    useEffect(() => {
        loadMascotas()
    }, [panelmascotas]);



    const midUser = (event) => {
        setUser(event.target.value);
    }

    const midPassword = (event) => {
        setPassword(event.target.value);
    }

    const switchMascotas = (event) => {
        setPanelmascotas(!panelmascotas);
    }

    const handleOpen = () => {
        setAddmascotas(true);
    };

    const handleClose = () => {
        setAddmascotas(false);
    };

    const handleOpenEdit = () => {
        setEditmascotas(true);
    };

    const handleCloseEdit = () => {
        setEditmascotas(false);
    };
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const onChangeAdd = (event) => {
        const row = event.target.id;
        let bici = {
            ...mascotaTemp,
        }
        if (row != 'vacunado' && row != 'adoptado') {
            bici[row] = event.target.value;
        } else {
            bici[row] = event.target.checked;
        }
        setMascotaTemp(bici)
    }

    const onClickCreate = (event) => {
        axios.post('http://localhost:8080/mascotas/crear/', mascotaTemp)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
        setAddmascotas(false);
    }

    const onChangeEdit = (event) => {
        const row = event.target.id;
        let bici = {
            ...mascotaEdit,
        }
        bici[row] = event.target.value;
        setMascotaEdit(bici)
        console.log(event.target)
    }

    const onClickEdit = () => {
        axios.put('http://localhost:8080/mascotas/editar/', mascotaEdit)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
        setEditmascotas(false);
    }

    const responseGoogle = (response) => {
        console.log(response);
    }

    const googleAuth = () => {
        setAuthenticated(true);
    }

    return (
        authenticated ?
            panelmascotas ?
                <div>
                    <button type="submit" className="btn btn-dark btn-lg btn-block" onClick={switchMascotas}>Home</button>
                    <MaterialTable
                        title="Red Mascotas"
                        data={mascotasList}
                        columns={columns}
                        tableRef={tableRef}
                        actions={[
                            {
                                icon: 'E',
                                tooltip: 'Edit User',
                                onClick: (event, rowData) => {
                                    setMascotaEdit(rowData);
                                    setEditmascotas(true);
                                }
                            },
                            {
                                icon: 'D',
                                tooltip: 'Delete User',
                                onClick: (event, rowData) => {
                                    const usuario = { data: { "id": rowData.id } }
                                    console.log(usuario)
                                    axios.delete('http://localhost:8080/mascotas/eliminar/', usuario)
                                        .then(response => {
                                            console.log(response)
                                        })
                                        .catch(error => {
                                            console.log(error);
                                        });
                                    loadMascotas();
                                }
                            }
                        ]}
                    />
                    <button type="submit" className="btn btn-dark btn-lg btn-block" onClick={handleOpen}>Add</button>

                    <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={addMascotas}
                        onClose={handleClose}
                    >

                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Agregar mascota
                            </Typography>
                            <TextField id="id" label="Id" variant="outlined" onChange={onChangeAdd} />
                            <TextField id="nombre" label="Nombre" variant="outlined" onChange={onChangeAdd} />
                            <TextField id="raza" label="Raza" variant="outlined" onChange={onChangeAdd} />
                            <TextField id="tipo" label="Tipo" variant="outlined" onChange={onChangeAdd} />
                            <TextField id="ubicacion" label="Ubicacion" variant="outlined" onChange={onChangeAdd} />
                            <div>
                                <label>
                                    <input type="checkbox" onChange={onChangeAdd} id="vacunado" />
                                    Vacunado
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input type="checkbox" onChange={onChangeAdd} id="adoptado" />
                                    Adoptado
                                </label>
                            </div>


                            <button className="btn btn-dark btn-lg btn-block" onClick={onClickCreate}>Agregar</button>
                        </Box>

                    </Modal>

                    <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={editMascotas}
                        onClose={handleCloseEdit}
                    >

                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Editar mascota
                            </Typography>
                            <TextField id="id" label="Id" variant="outlined" onChange={onChangeEdit} value={mascotaEdit.id} />
                            <TextField id="nombre" label="Nombre" variant="outlined" onChange={onChangeEdit} value={mascotaEdit.nombre} />
                            <TextField id="raza" label="Raza" variant="outlined" onChange={onChangeEdit} value={mascotaEdit.raza} />
                            <TextField id="tipo" label="Tipo" variant="outlined" onChange={onChangeEdit} value={mascotaEdit.tipo} />
                            <TextField id="ubicacion" label="Ubicacion" variant="outlined" onChange={onChangeEdit} value={mascotaEdit.ubicacion} />
                            <div>
                                <label>
                                    <input type="checkbox" onChange={onChangeAdd} id="vacunado" checked={mascotaEdit.vacunado} />
                                    Vacunado
                                </label>
                            </div>
                            <div>
                                <label>
                                    <input type="checkbox" onChange={onChangeAdd} id="adoptado" checked={mascotaEdit.adoptado} />
                                    Adoptado
                                </label>
                            </div>
                            <button className="btn btn-dark btn-lg btn-block" onClick={onClickEdit}>Agregar</button>
                        </Box>

                    </Modal>
                </div>
                :
                <div>
                    <button className="btn btn-dark btn-lg btn-block" onClick={switchMascotas}>Mascotas</button>
                    <div>
                        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {mascotasList.map(element => {
                                let [x, y] = element.ubicacion.split(',');
                                x = parseFloat(x)
                                y = parseFloat(y)
                                console.log(x, y)

                                return (
                                    <Marker position={[x, y]} key={x + y} icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}>
                                        <Popup>
                                            Id: {element.id} Nombre: {element.nombre} Raza: {element.raza} Tipo: {element.tipo} Adoptado: {element.adoptado} Vacunado: {element.vacunado} Ubicacion: {element.ubicacion} 
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MapContainer>
                    </div>
                </div>

            :
            <div>
                <h3>Log in</h3>
                <div className="form-group">
                    <label>User</label>
                    <input type="user" className="form-control" placeholder="Enter user" onChange={midUser} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" onChange={midPassword} />
                </div>

                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div>

                <button type="submit" className="btn btn-dark btn-lg btn-block" onClick={auth}>Sign in</button>
                <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p>
                <GoogleLogin
                    clientId="644418417223-a38qhqjmdo8e0vif2io8r40vk6jmk2v2.apps.googleusercontent.com"
                    render={renderProps => (
                        <button onClick={renderProps.onClick} disabled={renderProps.disabled}>This is my custom Google button</button>
                    )}
                    buttonText="Login"
                    onSuccess={googleAuth}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
            </div>

    );
}

export default Login;