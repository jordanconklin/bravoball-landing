import SwiftUI

// MARK: - Data Models
struct PrivacySection: Codable {
    let id: String
    let title: String
    let content: String
}

struct PrivacyPolicy: Codable {
    let lastUpdated: String
    let sections: [PrivacySection]
}

// MARK: - Privacy Policy Service
class PrivacyPolicyService: ObservableObject {
    @Published var privacyPolicy: PrivacyPolicy?
    @Published var isLoading = false
    @Published var error: String?
    
    func fetchPrivacyPolicy() {
        isLoading = true
        error = nil
        
        // Replace with your actual API endpoint
        guard let url = URL(string: "https://your-website.com/api/privacy-policy") else {
            error = "Invalid URL"
            isLoading = false
            return
        }
        
        URLSession.shared.dataTask(with: url) { [weak self] data, response, error in
            DispatchQueue.main.async {
                self?.isLoading = false
                
                if let error = error {
                    self?.error = error.localizedDescription
                    return
                }
                
                guard let data = data else {
                    self?.error = "No data received"
                    return
                }
                
                do {
                    let privacyPolicy = try JSONDecoder().decode(PrivacyPolicy.self, from: data)
                    self?.privacyPolicy = privacyPolicy
                } catch {
                    self?.error = "Failed to decode privacy policy: \(error.localizedDescription)"
                }
            }
        }.resume()
    }
}

// MARK: - Privacy Policy View
struct PrivacyPolicyView: View {
    @StateObject private var service = PrivacyPolicyService()
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                if service.isLoading {
                    HStack {
                        Spacer()
                        ProgressView()
                            .scaleEffect(1.5)
                        Spacer()
                    }
                    .padding(.top, 50)
                } else if let error = service.error {
                    VStack {
                        Image(systemName: "exclamationmark.triangle")
                            .font(.largeTitle)
                            .foregroundColor(.red)
                        Text("Error Loading Privacy Policy")
                            .font(.headline)
                            .padding(.top)
                        Text(error)
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.top, 5)
                    }
                    .padding(.top, 50)
                } else if let privacyPolicy = service.privacyPolicy {
                    // Header
                    Text("Privacy Policy")
                        .font(.custom("Poppins-Bold", size: 24))
                    
                    Text("Last updated: \(privacyPolicy.lastUpdated)")
                        .font(.custom("Poppins-Regular", size: 14))
                        .foregroundColor(.gray)
                    
                    // Sections
                    ForEach(privacyPolicy.sections, id: \.id) { section in
                        VStack(alignment: .leading, spacing: 10) {
                            Text(section.title)
                                .font(.custom("Poppins-Bold", size: 18))
                                .foregroundColor(.primary)
                            
                            Text(section.content)
                                .font(.custom("Poppins-Regular", size: 16))
                                .foregroundColor(.secondary)
                                .lineSpacing(4)
                        }
                        .padding(.vertical, 10)
                    }
                }
            }
            .padding()
        }
        .navigationTitle("Privacy Policy")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            if service.privacyPolicy == nil {
                service.fetchPrivacyPolicy()
            }
        }
    }
}

// MARK: - Usage Example
struct ContentView: View {
    var body: some View {
        NavigationView {
            VStack {
                Text("Welcome to BravoBall")
                    .font(.title)
                    .padding()
                
                NavigationLink(destination: PrivacyPolicyView()) {
                    Text("View Privacy Policy")
                        .font(.headline)
                        .foregroundColor(.white)
                        .padding()
                        .background(Color.blue)
                        .cornerRadius(10)
                }
            }
        }
    }
}

// MARK: - Preview
struct PrivacyPolicyView_Previews: PreviewProvider {
    static var previews: some View {
        PrivacyPolicyView()
    }
} 