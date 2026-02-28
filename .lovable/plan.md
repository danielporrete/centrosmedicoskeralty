

## Plan: Make Keralty logo fit the sidebar header

The logo in `Resultados.tsx` line 109 uses `className="h-8 mx-auto"` which constrains it to 32px height. The `SidebarHeader` has `p-4` padding.

### Changes

1. **`src/pages/Resultados.tsx` (line 109)**: Change the logo className to `w-full max-h-12 object-contain mx-auto` so it stretches to fill the available width while maintaining aspect ratio.

2. **`src/components/KeraltyLogo.tsx`**: Add `object-contain` to the default className to ensure the image always scales properly without cropping.

These changes will make the logo use the full width of the sidebar header, scaling up as much as possible within the container.

