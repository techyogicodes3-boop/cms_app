export const CHOCOTRAILL_CONTACT = {
  whatsappNumber: "917208136113",
  phoneDisplay: "+91 72081 36113",
  phoneHref: "+917208136113",
  email: "nisha@chocotraill.com",
};

export function parseCartPrice(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    return Number(value.replace(/[₹,$\s]/g, "").replace(/,/g, "")) || 0;
  }
  return 0;
}

export function calculateCartAmounts(items = [], discount = 0) {
  const subtotal = items.reduce((sum, item) => {
    const quantity = Number(item.quantity || 1);
    return sum + parseCartPrice(item.price) * (Number.isFinite(quantity) && quantity > 0 ? quantity : 1);
  }, 0);

  const safeDiscount = Math.max(0, parseCartPrice(discount));
  const total = Math.max(0, subtotal - safeDiscount);

  return {
    subtotal,
    shipping: 0,
    tax: 0,
    discount: safeDiscount,
    total,
    itemCount: items.reduce((sum, item) => {
      const quantity = Number(item.quantity || 1);
      return sum + (Number.isFinite(quantity) && quantity > 0 ? quantity : 1);
    }, 0),
  };
}

function formatAmount(value) {
  return parseCartPrice(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function buildWhatsAppUrl(lines) {
  return `https://wa.me/${CHOCOTRAILL_CONTACT.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function buildWhatsAppCheckoutUrl(items = [], totalAmount, customer = {}) {
  const computed = calculateCartAmounts(items);
  const orderTotal = totalAmount != null ? parseCartPrice(totalAmount) : computed.total;
  const lines = [
    "Hello Chocotraill Team,",
    "I would like to place an order.",
    "",
    "Order details:",
  ];

  items.forEach((item, index) => {
    const name = item.title || item.name || item.catalogueItemId || `Product ${index + 1}`;
    const quantity = Number(item.quantity || 1);
    const price = parseCartPrice(item.price);
    const lineTotal = price * quantity;
    const image = item.image || item.imageUrl || item.thumbnail || item.coverImage;

    lines.push(
      `${index + 1}. ${name}`,
      `   Qty: ${quantity}`,
      `   Unit price: ₹${formatAmount(price)}`,
      `   Item total: ₹${formatAmount(lineTotal)}`,
      ...(image ? [`   Image: ${image}`] : [])
    );
  });

  lines.push(
    "",
    "Order summary:",
    `Subtotal: ₹${formatAmount(computed.subtotal)}`,
    `Order total: ₹${formatAmount(orderTotal)}`,
    "Delivery: Please confirm delivery charges and availability on WhatsApp."
  );

  if (customer.name || customer.phone || customer.address || customer.message) {
    lines.push("", "Customer details:");
    if (customer.name) lines.push(`Name: ${customer.name}`);
    if (customer.phone) lines.push(`Phone: ${customer.phone}`);
    if (customer.address) lines.push(`Address: ${customer.address}`);
    if (customer.message) lines.push(`Message: ${customer.message}`);
  }

  return buildWhatsAppUrl(lines);
}

export function buildWhatsAppInquiryUrl(form = {}) {
  const lines = [
    "Hello Chocotraill Team,",
    "I would like to make an inquiry.",
    "",
    "Customer details:",
    `Name: ${form.name || "-"}`,
    `Phone: ${form.phone || "-"}`,
    `Subject: ${form.subject || "-"}`,
    "",
    "Message:",
    form.message || "-",
  ];

  return buildWhatsAppUrl(lines);
}

export function redirectToWhatsAppCheckout(items, totalAmount, customer) {
  if (typeof window === "undefined") return;
  window.location.href = buildWhatsAppCheckoutUrl(items, totalAmount, customer);
}
