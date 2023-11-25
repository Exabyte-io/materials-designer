import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import IconByName from "@exabyte-io/cove.js/dist/mui/components/icon/IconByName";
import { Made } from "@exabyte-io/made.js";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React from "react";
import NPMsAlert from "react-s-alert";
import _ from "underscore";

import { displayMessage } from "../../../i18n/messages";
import { Material } from "../../../material";
import BasisText from "../../source_editor/BasisText";

// TODO: adjust this component and SourceEditor to inherit from the same one - XYZBasisEditor

class CombinatorialBasisDialog extends React.Component {
    constructor(props) {
        super(props);
        const { material } = this.props;

        this.state = {
            xyz: material.getBasisAsXyz(),
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(content) {
        // update the input field immediately on typing
        this.setState({ xyz: content });
    }

    handleSubmit() {
        if (!this.BasisTextComponent.state.isContentValidated) return; // don't proceed if cannot validate xyz
        const { xyz } = this.state;
        const { material, onSubmit } = this.props;
        // TODO: avoid modifying materials directly inside this component move the below logic to reducer

        // create combinatorial set from a given basis
        const newBases = new Made.parsers.xyz.CombinatorialBasis(xyz).allBasisConfigs;

        if (!this.assertCombinatorialBasesCount(newBases)) return;

        const newMaterials = [];
        // eslint-disable-next-line no-unused-vars
        _.each(newBases, (elm, idx) => {
            // first set units from existing material, as allBasises() returns no units
            const latticeConfig = material.lattice;
            const lattice = new Made.Lattice(latticeConfig);
            const basisConfig = { ...material.basis, ...elm };
            const basis = new Made.Basis({
                ...basisConfig,
                cell: lattice.vectorArrays,
            });
            // then create material
            const newMaterialConfig = {
                ...material.toJSON(),
                basis: basis.toJSON(),
                name: `${material.name} - ${basis.formula}`,
            };
            const newMaterial = new Material(newMaterialConfig);
            newMaterial.cleanOnCopy();
            newMaterials.push(newMaterial);
        });
        // pass up the chain
        onSubmit(newMaterials);
    }

    assertCombinatorialBasesCount(bases) {
        const { maxCombinatorialBasesCount } = this.props;
        if (bases.length > maxCombinatorialBasesCount) {
            NPMsAlert.warning(
                displayMessage("combinatorialBasesCountExceeded", maxCombinatorialBasesCount),
            );
            return false;
        }
        return true;
    }

    render() {
        const { isOpen, onHide, title } = this.props;
        const { xyz } = this.state;

        return (
            <Dialog
                open={isOpen}
                renderHeaderCustom={() => (
                    <Box
                        sx={{
                            m: 3,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h6">
                            {title}
                            <a
                                className="m-l-10 combinatorial-info"
                                href="https://docs.exabyte.io/materials-designer/header-menu/advanced/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Combinatorial Basis"
                            >
                                <IconByName name="shapes.info" />
                            </a>
                        </Typography>
                        <IconButton color="default" onClick={onHide}>
                            <IconByName name="actions.close" fontSize="small" />
                        </IconButton>
                    </Box>
                )}
                renderFooterCustom={() => (
                    <DialogActions>
                        <Button
                            id="generate-combinatorial"
                            onClick={this.handleSubmit}
                            variant="outlined"
                            fullWidth
                            sx={{ m: 2 }}
                        >
                            Generate Combinatorial Set
                        </Button>
                    </DialogActions>
                )}
            >
                <BasisText
                    ref={(el) => {
                        this.BasisTextComponent = el;
                    }}
                    className="combinatorial-basis"
                    content={xyz}
                    onChange={this.handleChange}
                />
            </Dialog>
        );
    }
}

CombinatorialBasisDialog.propTypes = {
    title: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    material: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    maxCombinatorialBasesCount: PropTypes.number,
};

CombinatorialBasisDialog.defaultProps = {
    maxCombinatorialBasesCount: 100,
};

export default CombinatorialBasisDialog;
