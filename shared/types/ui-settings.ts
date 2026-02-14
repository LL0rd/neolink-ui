/** UI-only settings stored separately from the neolink TOML config */
export interface UiSettings {
  /** Custom hostname or IP for RTSP stream URLs (overrides auto-detected IP) */
  rtsp_host?: string
}
