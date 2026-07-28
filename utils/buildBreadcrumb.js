export function buildBreadcrumb({ catalogue, item }) {
  const items = [
    { label: 'Home', href: '/home' },
    { label: 'Catalogues', href: '/catalogues' },
  ];

  const catalogueLabel = catalogue?.catalogueName || catalogue?.name || catalogue?.title;

  if (catalogueLabel) {
    const id = catalogue.uuid || catalogue.id;

    items.push({
      label: catalogueLabel,
      href: id ? `/catalogues/${id}` : undefined,
    });
  }

  if (item?.name) {
    items.push({
      label: item.name,
    });
  }

  return items;
}
