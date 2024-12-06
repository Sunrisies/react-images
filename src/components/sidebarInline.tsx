export const SidebarInline = () => {
  return (
    <>
      <Menu
        mode="inline"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        selectedKeys={[pathname]}
        items={menuItems as MenuProps['items']}
        onClick={(e) => navigate(e.key)}
        style={{ border: 'none' }}
      />
    </>
  )
}
