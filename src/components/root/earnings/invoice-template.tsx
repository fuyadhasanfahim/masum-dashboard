import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
} from '@react-pdf/renderer';


Font.register({ family: 'Inter', src: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf' });
Font.register({ family: 'Inter-Bold', src: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf' });
Font.register({ family: 'JetBrains Mono', src: 'https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.ttf' });
Font.register({ family: 'JetBrains Mono-Bold', src: 'https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-700-normal.ttf' });

const PRIMARY_COLOR = '#ea580c'; // Matches the app's default vibrant orange primary color
const TEXT_MAIN = '#1f2937';
const TEXT_MUTED = '#6b7280';
const BORDER_COLOR = '#e5e7eb';
const BG_LIGHT = '#f9fafb';
const BG_MUTED = '#f3f4f6';

const styles = StyleSheet.create({
    page: {
        paddingTop: 40,
        paddingBottom: 60,
        paddingHorizontal: 40,
        fontFamily: 'Inter',
        fontSize: 10,
        color: TEXT_MAIN,
        backgroundColor: '#ffffff',
    },
    // Header Section
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
        paddingBottom: 20,
        marginBottom: 30,
    },
    companyBranding: {
        flex: 1,
    },
    companyName: {
        fontSize: 28,
        fontFamily: 'Inter-Bold',
        color: PRIMARY_COLOR,
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    companyTagline: {
        fontSize: 9,
        color: TEXT_MUTED,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    invoiceMetaContainer: {
        alignItems: 'flex-end',
    },
    invoiceTitle: {
        fontSize: 24,
        fontFamily: 'Inter-Bold',
        letterSpacing: 4,
        color: TEXT_MAIN,
        marginBottom: 10,
    },
    metaRow: {
        flexDirection: 'row',
        marginBottom: 4,
        alignItems: 'center',
    },
    metaLabel: {
        fontSize: 10,
        color: TEXT_MUTED,
        width: 90,
        textAlign: 'right',
        paddingRight: 10,
        fontFamily: 'Inter-Bold',
    },
    metaValue: {
        fontSize: 10,
        color: TEXT_MAIN,
        width: 90,
        textAlign: 'right',
        fontFamily: 'JetBrains Mono-Bold',
    },
    // Bill To Section
    billToSection: {
        backgroundColor: BG_LIGHT,
        borderRadius: 6,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: PRIMARY_COLOR,
        marginBottom: 30,
    },
    billToHeader: {
        fontSize: 9,
        color: TEXT_MUTED,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontFamily: 'Inter-Bold',
        marginBottom: 8,
    },
    clientName: {
        fontSize: 14,
        fontFamily: 'Inter-Bold',
        color: TEXT_MAIN,
        marginBottom: 4,
    },
    clientEmail: {
        fontSize: 10,
        color: TEXT_MUTED,
    },
    // Table Section
    tableContainer: {
        marginBottom: 30,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 4,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    thText: {
        color: '#ffffff',
        fontSize: 9,
        fontFamily: 'Inter-Bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    tableRowEven: {
        backgroundColor: '#fafafa',
    },
    col1: { flex: 4 }, // Order
    col2: { flex: 1.5, textAlign: 'center' }, // Images
    col3: { flex: 2, textAlign: 'right' }, // Per Image
    col4: { flex: 2.5, textAlign: 'right' }, // Total
    tdText: {
        fontSize: 10,
        color: TEXT_MAIN,
        fontFamily: 'JetBrains Mono',
    },
    tdTextBold: {
        fontSize: 10,
        fontFamily: 'JetBrains Mono-Bold',
        color: TEXT_MAIN,
    },
    // Summary Section
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    summaryWrapper: {
        width: 250,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
    },
    summaryLabel: {
        fontSize: 10,
        color: TEXT_MUTED,
        fontFamily: 'Inter-Bold',
    },
    summaryValue: {
        fontSize: 10,
        color: TEXT_MAIN,
        fontFamily: 'Inter-Bold',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: BG_MUTED,
        borderRadius: 6,
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 14,
        fontFamily: 'Inter-Bold',
        color: PRIMARY_COLOR,
    },
    totalValue: {
        fontSize: 16,
        fontFamily: 'Inter-Bold',
        color: PRIMARY_COLOR,
    },
    // Footer Section
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: BORDER_COLOR,
    },
    footerText: {
        fontSize: 8,
        color: TEXT_MUTED,
        letterSpacing: 0.5,
    },
});

interface InvoiceOrder {
    title: string;
    images: number;
    perImagePrice: number;
    totalPrice: number;
}

interface InvoiceTemplateProps {
    clientName: string;
    clientEmail: string;
    month: number;
    year: number;
    totalImages: number;
    totalPrice: number;
    currency: string;
    orders: InvoiceOrder[];
    invoiceNumber?: string;
}

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

export function InvoiceTemplate({
    clientName,
    clientEmail,
    month,
    year,
    totalImages,
    totalPrice,
    currency,
    orders,
    invoiceNumber,
}: InvoiceTemplateProps) {
    const monthName = monthNames[month - 1];
    const invNum = invoiceNumber || `INV-${year}${String(month).padStart(2, '0')}`;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <View style={styles.companyBranding}>
                        <Text style={styles.companyName}>Masum Kamal</Text>
                        <Text style={styles.companyTagline}>
                            Graphics Designer
                        </Text>
                    </View>
                    <View style={styles.invoiceMetaContainer}>
                        <Text style={styles.invoiceTitle}>INVOICE</Text>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Invoice Number:</Text>
                            <Text style={styles.metaValue}>{invNum}</Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Period:</Text>
                            <Text style={styles.metaValue}>{monthName} {year}</Text>
                        </View>
                    </View>
                </View>

                {/* Bill To */}
                <View style={styles.billToSection}>
                    <Text style={styles.billToHeader}>Billed To:</Text>
                    <Text style={styles.clientName}>{clientName}</Text>
                    {clientEmail && (
                        <Text style={styles.clientEmail}>{clientEmail}</Text>
                    )}
                </View>

                {/* Table */}
                <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        <View style={styles.col1}>
                            <Text style={styles.thText}>Description</Text>
                        </View>
                        <View style={styles.col2}>
                            <Text style={styles.thText}>Images</Text>
                        </View>
                        <View style={styles.col3}>
                            <Text style={styles.thText}>Rate</Text>
                        </View>
                        <View style={styles.col4}>
                            <Text style={styles.thText}>Amount</Text>
                        </View>
                    </View>

                    {orders.map((order, i) => (
                        <View
                            style={[
                                styles.tableRow,
                                i % 2 !== 0 ? styles.tableRowEven : {},
                            ]}
                            key={i}
                        >
                            <View style={styles.col1}>
                                <Text style={styles.tdTextBold}>
                                    {order.title || 'Untitled Service'}
                                </Text>
                            </View>
                            <View style={styles.col2}>
                                <Text style={styles.tdText}>
                                    {order.images || 0}
                                </Text>
                            </View>
                            <View style={styles.col3}>
                                <Text style={styles.tdText}>
                                    {currency}{(order.perImagePrice || 0).toFixed(2)}
                                </Text>
                            </View>
                            <View style={styles.col4}>
                                <Text style={styles.tdTextBold}>
                                    {currency}{(order.totalPrice || 0).toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Summary */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryWrapper}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Subtotal</Text>
                            <Text style={styles.summaryValue}>
                                {currency}{totalPrice.toFixed(2)}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Images</Text>
                            <Text style={styles.summaryValue}>{totalImages}</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Grand Total</Text>
                            <Text style={styles.totalValue}>
                                {currency}{totalPrice.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Thank you for your business. This invoice was generated automatically.
                    </Text>
                </View>
            </Page>
        </Document>
    );
}
