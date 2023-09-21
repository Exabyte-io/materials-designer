import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React from "react";

class InterfaceBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            materials: props.materials,
            stackedMaterials: [],
        };
    }

    componentDidUpdate(prevProps) {
        const { materials } = this.props;
        // eslint-disable-next-line react/no-did-update-set-state
        if (prevProps.materials !== materials) this.setState({ materials });
    }

    handleDrop = (e) => {
        const materialIndex = parseInt(e.dataTransfer.getData("materialIndex"), 10);
        const { stackedMaterials, materials } = this.state;
        const material = materials[materialIndex];

        if (!stackedMaterials.some((m) => m.name === material.name)) {
            this.setState((prevState) => ({
                stackedMaterials: [...prevState.stackedMaterials, material],
            }));
            console.log(material);
        }
    };

    handleSubmit = () => {
        const { stackedMaterials } = this.state;
        const { onSubmit } = this.props;

        onSubmit(stackedMaterials);

        this.setState({ stackedMaterials: [] });
    };

    render() {
        const { materials, stackedMaterials } = this.state;
        const { show } = this.props;
        return (
            <Dialog open={show}>
                <DialogTitle>Interface Builder</DialogTitle>
                <DialogContent>
                    <Box display="flex" p={3}>
                        <Box flex="1" pr={2} minWidth={100}>
                            <Typography variant="h6">Materials</Typography>
                            <List>
                                {materials.map((material) => (
                                    <ListItem
                                        key={material.id}
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData(
                                                "materialIndex",
                                                materials.indexOf(material).toString(),
                                            );
                                        }}
                                    >
                                        <ListItemText primary={material.name} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                        <Box
                            flex="2"
                            pl={2}
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-start"
                            border="1px solid #ccc"
                            minHeight={300}
                            minWidth={400}
                            onDrop={this.handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            {stackedMaterials.map((material) => (
                                <Box
                                    key={material.id}
                                    display="flex"
                                    flexDirection="row"
                                    border="1px solid #ccc"
                                >
                                    <Typography>{material.name}</Typography>
                                    <Typography>{material.formula}</Typography>
                                    <Typography>{material.lattice.type}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

InterfaceBuilder.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    materials: PropTypes.array.isRequired,
};

export default InterfaceBuilder;
