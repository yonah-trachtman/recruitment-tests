const backGroundColor = "#000000";
export const themeColor = "#ABE5F7";

export const manifest = (env: "PreProd" | "Local" | "" = ``) => ({
  short_name: `Offisito Admin${!env ? "" : " " + env}`,
  name: `Offisito Admin App${!env ? "" : " " + env}`,
  icons: [
    {
      src: `icons/l192.png`,
      type: `image/png`,
      sizes: `192x192`,
    },
    {
      src: `icons/l512.png`,
      type: `image/png`,
      sizes: `512x512`,
    },
  ],
  id: `/?source=pwa`,
  start_url: `/?source=pwa`,
  background_color: backGroundColor,
  display: `standalone`,
  scope: `/`,
  theme_color: themeColor,
  description: `Offisito Admin Web App for internal Admins`,
});
