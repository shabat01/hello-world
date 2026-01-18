//
//  ContactListView.swift
//  SecureMessenger
//
//  Contact list with trust status indicators
//

import SwiftUI

struct ContactListView: View {
    @StateObject private var viewModel: ContactListViewModel

    init(messageManager: MessageManager) {
        self._viewModel = StateObject(wrappedValue: ContactListViewModel(messageManager: messageManager))
    }

    var body: some View {
        NavigationView {
            List {
                Section {
                    ForEach(viewModel.contacts) { contact in
                        NavigationLink(destination: ConversationView(
                            recipientId: contact.id,
                            recipientName: contact.name,
                            messageManager: viewModel.messageManager
                        )) {
                            ContactRow(contact: contact)
                        }
                    }
                }

                Section("Security") {
                    SecurityMetricsView(metrics: viewModel.securityMetrics)
                }
            }
            .navigationTitle("SecureMessenger")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { viewModel.showingAddContact = true }) {
                        Image(systemName: "person.badge.plus")
                    }
                }
            }
            .sheet(isPresented: $viewModel.showingAddContact) {
                AddContactView(messageManager: viewModel.messageManager) { contact in
                    viewModel.addContact(contact)
                }
            }
        }
    }
}

// MARK: - Contact Row

struct ContactRow: View {
    let contact: Contact

    var body: some View {
        HStack(spacing: 12) {
            // Avatar
            Circle()
                .fill(Color.blue.gradient)
                .frame(width: 50, height: 50)
                .overlay {
                    Text(contact.initials)
                        .font(.headline)
                        .foregroundColor(.white)
                }

            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(contact.name)
                        .font(.headline)

                    if contact.isTrusted {
                        Image(systemName: "checkmark.shield.fill")
                            .font(.caption)
                            .foregroundColor(.green)
                    }
                }

                Text(contact.id)
                    .font(.caption)
                    .foregroundColor(.secondary)

                if contact.lastMessage != nil {
                    Text(contact.lastMessage!)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .lineLimit(1)
                }
            }

            Spacer()

            if contact.unreadCount > 0 {
                Text("\(contact.unreadCount)")
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.blue)
                    .clipShape(Capsule())
            }
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Security Metrics View

struct SecurityMetricsView: View {
    let metrics: MessageManager.SecurityMetrics

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            MetricRow(
                icon: "key.fill",
                title: "Ephemeral Keys",
                value: "\(metrics.totalKeysConstructed) constructed",
                color: .blue
            )

            MetricRow(
                icon: "trash.fill",
                title: "Keys Destroyed",
                value: "\(metrics.totalKeysDestroyed) destroyed",
                color: .green
            )

            MetricRow(
                icon: "link.badge.checkmark",
                title: "Trust Relationships",
                value: "\(metrics.activeTrustRelationships) active",
                color: .purple
            )

            MetricRow(
                icon: "checkmark.shield.fill",
                title: "Operating Mode",
                value: metrics.fipsMode ? "FIPS 140-2" : "Standard",
                color: metrics.fipsMode ? .green : .orange
            )
        }
    }
}

struct MetricRow: View {
    let icon: String
    let title: String
    let value: String
    let color: Color

    var body: some View {
        HStack {
            Image(systemName: icon)
                .foregroundColor(color)
                .frame(width: 24)

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.subheadline)
                Text(value)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
    }
}

// MARK: - Add Contact View

struct AddContactView: View {
    @Environment(\.dismiss) private var dismiss
    let messageManager: MessageManager
    let onAdd: (Contact) -> Void

    @State private var contactId = ""
    @State private var contactName = ""
    @State private var isAdding = false
    @State private var errorMessage: String?

    var body: some View {
        NavigationView {
            Form {
                Section("Contact Information") {
                    TextField("Contact ID", text: $contactId)
                        .autocapitalization(.none)
                        .autocorrectionDisabled()

                    TextField("Name", text: $contactName)
                }

                Section {
                    Button(action: addContact) {
                        if isAdding {
                            ProgressView()
                        } else {
                            Text("Add Contact")
                        }
                    }
                    .disabled(contactId.isEmpty || contactName.isEmpty || isAdding)
                }

                if let error = errorMessage {
                    Section {
                        Text(error)
                            .foregroundColor(.red)
                            .font(.caption)
                    }
                }

                Section("About") {
                    Label("Establishes KnectIQ SelectiveTRUST® relationship", systemImage: "shield.checkmark")
                        .font(.caption)
                        .foregroundColor(.secondary)

                    Label("Real-time trust validation enabled", systemImage: "checkmark.circle")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            .navigationTitle("Add Contact")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }

    private func addContact() {
        isAdding = true
        errorMessage = nil

        Task {
            do {
                try await messageManager.addTrustedContact(contactId: contactId)

                await MainActor.run {
                    let contact = Contact(
                        id: contactId,
                        name: contactName,
                        isTrusted: true,
                        lastMessage: nil,
                        unreadCount: 0
                    )
                    onAdd(contact)
                    dismiss()
                }
            } catch {
                await MainActor.run {
                    errorMessage = error.localizedDescription
                    isAdding = false
                }
            }
        }
    }
}

// MARK: - View Model

class ContactListViewModel: ObservableObject {
    @Published var contacts: [Contact] = []
    @Published var securityMetrics: MessageManager.SecurityMetrics
    @Published var showingAddContact = false

    let messageManager: MessageManager

    init(messageManager: MessageManager) {
        self.messageManager = messageManager
        self.securityMetrics = messageManager.getSecurityMetrics()

        // Load contacts (demo data)
        loadDemoContacts()

        // Start metrics refresh timer
        Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            self?.updateMetrics()
        }
    }

    private func loadDemoContacts() {
        contacts = [
            Contact(
                id: "bob-001",
                name: "Bob Anderson",
                isTrusted: true,
                lastMessage: "See you tomorrow!",
                unreadCount: 0
            ),
            Contact(
                id: "charlie-002",
                name: "Charlie Brown",
                isTrusted: true,
                lastMessage: "Thanks for the update",
                unreadCount: 2
            )
        ]
    }

    func addContact(_ contact: Contact) {
        contacts.append(contact)
    }

    private func updateMetrics() {
        securityMetrics = messageManager.getSecurityMetrics()
    }
}

// MARK: - Models

struct Contact: Identifiable {
    let id: String
    let name: String
    var isTrusted: Bool
    var lastMessage: String?
    var unreadCount: Int

    var initials: String {
        let components = name.components(separatedBy: " ")
        let firstInitial = components.first?.prefix(1) ?? ""
        let lastInitial = components.count > 1 ? components.last?.prefix(1) ?? "" : ""
        return "\(firstInitial)\(lastInitial)".uppercased()
    }
}

// MARK: - Preview

struct ContactListView_Previews: PreviewProvider {
    static var previews: some View {
        ContactListView(
            messageManager: MessageManager(
                userId: "alice-001",
                config: IntegrationConfig(trustEnvironmentName: "preview")
            )
        )
    }
}
