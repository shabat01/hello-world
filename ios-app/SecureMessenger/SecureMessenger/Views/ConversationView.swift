//
//  ConversationView.swift
//  SecureMessenger
//
//  Chat interface with SelectiveTRUST® + Signal E2E encryption
//

import SwiftUI

struct ConversationView: View {
    @StateObject private var viewModel: ConversationViewModel
    let recipientId: String
    let recipientName: String

    @State private var messageText = ""
    @FocusState private var isInputFocused: Bool

    init(recipientId: String, recipientName: String, messageManager: MessageManager) {
        self.recipientId = recipientId
        self.recipientName = recipientName
        self._viewModel = StateObject(wrappedValue: ConversationViewModel(
            recipientId: recipientId,
            messageManager: messageManager
        ))
    }

    var body: some View {
        VStack(spacing: 0) {
            // Messages list
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: 12) {
                        ForEach(viewModel.messages) { message in
                            MessageBubble(message: message, currentUserId: viewModel.currentUserId)
                                .id(message.id)
                        }
                    }
                    .padding()
                }
                .onChange(of: viewModel.messages.count) { _ in
                    if let lastMessage = viewModel.messages.last {
                        withAnimation {
                            proxy.scrollTo(lastMessage.id, anchor: .bottom)
                        }
                    }
                }
            }

            // Security status bar
            SecurityStatusBar(metrics: viewModel.securityMetrics)

            // Input area
            MessageInputBar(
                messageText: $messageText,
                isInputFocused: $isInputFocused,
                onSend: sendMessage
            )
        }
        .navigationTitle(recipientName)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                SecurityBadge(metrics: viewModel.securityMetrics)
            }
        }
    }

    private func sendMessage() {
        guard !messageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            return
        }

        Task {
            await viewModel.sendMessage(messageText)
            messageText = ""
        }
    }
}

// MARK: - Message Bubble

struct MessageBubble: View {
    let message: Message
    let currentUserId: String

    private var isFromCurrentUser: Bool {
        message.senderId == currentUserId
    }

    var body: some View {
        HStack {
            if isFromCurrentUser {
                Spacer()
            }

            VStack(alignment: isFromCurrentUser ? .trailing : .leading, spacing: 4) {
                Text(message.content)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                    .background(isFromCurrentUser ? Color.blue : Color(uiColor: .systemGray5))
                    .foregroundColor(isFromCurrentUser ? .white : .primary)
                    .cornerRadius(18)

                HStack(spacing: 4) {
                    if message.isEphemeralEncrypted {
                        Image(systemName: "shield.checkmark.fill")
                            .font(.caption2)
                            .foregroundColor(.green)
                    }

                    Text(message.timestamp, style: .time)
                        .font(.caption2)
                        .foregroundColor(.secondary)

                    if isFromCurrentUser {
                        statusIcon
                    }
                }
                .padding(.horizontal, 4)
            }

            if !isFromCurrentUser {
                Spacer()
            }
        }
    }

    @ViewBuilder
    private var statusIcon: some View {
        switch message.status {
        case .sending:
            ProgressView()
                .scaleEffect(0.7)
        case .sent:
            Image(systemName: "checkmark")
                .font(.caption2)
        case .delivered:
            Image(systemName: "checkmark.circle.fill")
                .font(.caption2)
                .foregroundColor(.green)
        case .failed:
            Image(systemName: "exclamationmark.circle.fill")
                .font(.caption2)
                .foregroundColor(.red)
        }
    }
}

// MARK: - Security Status Bar

struct SecurityStatusBar: View {
    let metrics: MessageManager.SecurityMetrics

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "lock.shield.fill")
                .foregroundColor(.green)
                .font(.caption)

            VStack(alignment: .leading, spacing: 2) {
                Text("SelectiveTRUST® + Signal E2E")
                    .font(.caption)
                    .fontWeight(.medium)

                Text("Ephemeral Keys: \(metrics.totalKeysConstructed) constructed, \(metrics.totalKeysDestroyed) destroyed")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }

            Spacer()

            if metrics.fipsMode {
                Text("FIPS")
                    .font(.caption2)
                    .fontWeight(.bold)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(Color.green.opacity(0.2))
                    .foregroundColor(.green)
                    .cornerRadius(4)
            }
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
        .background(Color(uiColor: .systemGray6))
    }
}

// MARK: - Message Input Bar

struct MessageInputBar: View {
    @Binding var messageText: String
    var isInputFocused: FocusState<Bool>.Binding
    let onSend: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            TextField("Message", text: $messageText, axis: .vertical)
                .textFieldStyle(.roundedBorder)
                .focused(isInputFocused)
                .lineLimit(1...5)
                .onSubmit(onSend)

            Button(action: onSend) {
                Image(systemName: "arrow.up.circle.fill")
                    .font(.title2)
                    .foregroundColor(messageText.isEmpty ? .gray : .blue)
            }
            .disabled(messageText.isEmpty)
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
        .background(Color(uiColor: .systemBackground))
    }
}

// MARK: - Security Badge

struct SecurityBadge: View {
    let metrics: MessageManager.SecurityMetrics

    var body: some View {
        Button(action: {}) {
            HStack(spacing: 4) {
                Image(systemName: "shield.checkmark.fill")
                    .font(.caption)
                    .foregroundColor(.green)

                if metrics.activeEphemeralKeys > 0 {
                    Text("\(metrics.activeEphemeralKeys)")
                        .font(.caption2)
                        .fontWeight(.bold)
                }
            }
        }
    }
}

// MARK: - View Model

class ConversationViewModel: ObservableObject {
    @Published var messages: [Message] = []
    @Published var securityMetrics: MessageManager.SecurityMetrics

    let currentUserId: String
    let recipientId: String
    private let messageManager: MessageManager

    init(recipientId: String, messageManager: MessageManager) {
        self.recipientId = recipientId
        self.messageManager = messageManager
        self.currentUserId = messageManager.userId
        self.securityMetrics = messageManager.getSecurityMetrics()

        // Load messages
        self.messages = messageManager.messages.filter {
            ($0.senderId == currentUserId && $0.recipientId == recipientId) ||
            ($0.senderId == recipientId && $0.recipientId == currentUserId)
        }

        // Start metrics refresh timer
        Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            self?.updateMetrics()
        }
    }

    func sendMessage(_ text: String) async {
        do {
            try await messageManager.sendMessage(text, to: recipientId)
            await MainActor.run {
                loadMessages()
                updateMetrics()
            }
        } catch {
            print("Failed to send message: \(error)")
        }
    }

    private func loadMessages() {
        messages = messageManager.messages.filter {
            ($0.senderId == currentUserId && $0.recipientId == recipientId) ||
            ($0.senderId == recipientId && $0.recipientId == currentUserId)
        }
    }

    private func updateMetrics() {
        securityMetrics = messageManager.getSecurityMetrics()
    }
}

// MARK: - Preview

struct ConversationView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            ConversationView(
                recipientId: "bob-001",
                recipientName: "Bob",
                messageManager: MessageManager(
                    userId: "alice-001",
                    config: IntegrationConfig(trustEnvironmentName: "preview")
                )
            )
        }
    }
}
