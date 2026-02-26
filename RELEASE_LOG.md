# What-If Lab Release Log - V2.2

## [V2.2] - 2026-02-26
### Added
- **Mathematics-Style Axis Labeling**: GPA and SAT labels are now directly embedded at the ends of the axes for a more rigorous academic look.
- **Physical Truncation Marks**: Added double-slash marks at the origin to denote non-zero starting points (GPA 2.5, SAT 1200), improving scientific accuracy.
- **Unified Tactile DNA**: Applied `btn-tactile` (chamfered corners) to the Decision Margin module for full system UI consistency.

### Changed
- **Coordinate System Optimization**: Adjusted default viewing ranges to GPA [2.5-4.0] and SAT [1200-1600] to reduce whitespace and increase data density.
- **Dashboard Rebalancing**: 
    - Updated grid proportions to a symmetrical **20% : 60% : 20%** for better visual stability.
    - Expanded central Counterfactual Visualizer to 60% width.
- **Micro-UX Polish**:
    - Unified all help buttons (HelpCircle) to match adjacent font sizes.
    - Shortened Lab Guide and Ethics Scanner to `h-24` and synchronized their internal vertical alignment.
    - Reduced font sizes in the Result Indicator for a more compact, data-dense look.
    - Minimized vertical spacing between feature sliders and their labels.

### Fixed
- **Modal Congestion**: Removed redundant 'X' close buttons in favor of 'OK' buttons and compressed top padding for a tighter UI.
- **Visual Overlap**: Resolved clipping issues for GPA/SAT axis labels by adjusting chart margins.
- **Geometric Inconsistency**: Fixed the Decision Margin container's "pill" shape, reverting it to consistent chamfered corners.
