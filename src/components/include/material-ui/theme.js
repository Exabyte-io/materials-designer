import { createTheme } from "@mui/material";
import { adaptV4Theme } from "@mui/material/styles";

// adopted from: https://material-ui.com/customization/themes/#theme-configuration-variables
const DarkThemeConfig = {
    palette: {
        // Switching the dark mode on is a single property value change.
        mode: "dark",
    },
    typography: {
        // Tell Material-UI what's the font-size on the html element is.
        htmlFontSize: 12,
    },
    overrides: {
        MuiFormControl: {
            root: {
                margin: 10,
                minWidth: 120,
            },
        },
    },
};

export const DarkMaterialUITheme = createTheme(adaptV4Theme(DarkThemeConfig));

export const LightMaterialUITheme = createTheme(
    adaptV4Theme({
        typography: DarkThemeConfig.typography,
        palette: {
            mode: "light",
        },
    }),
);
