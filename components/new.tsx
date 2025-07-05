export function New() {
  return (
    <div className="ml-16 md:ml-20 min-h-screen">
      <div id="header" className="bg-white border-b border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-semibold">
              Analytics &amp; AI Insights
            </h1>
            <span className="text-xs px-2 py-1 bg-primary-50 text-primary-600 rounded-full">
              Deep Analytics
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
              <button className="px-3 py-1 rounded-md bg-white text-sm font-medium shadow-sm">
                Overview
              </button>
              <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
                Assistant-level
              </button>
            </div>

            <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors">
              <i className="fa-solid fa-download"></i>
              <span>Download Report</span>
            </button>

            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="fa-solid fa-moon text-lg"></i>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative bg-gray-50 rounded-lg px-3 py-2 flex items-center space-x-2 border border-gray-200 hover:border-gray-300 transition-all cursor-pointer">
              <i className="fa-regular fa-calendar text-gray-500"></i>
              <span className="text-sm font-medium">Last 30 days</span>
              <i className="fa-solid fa-chevron-down text-xs text-gray-500"></i>
            </div>

            <div className="relative bg-gray-50 rounded-lg px-3 py-2 flex items-center space-x-2 border border-gray-200 hover:border-gray-300 transition-all cursor-pointer">
              <i className="fa-solid fa-robot text-gray-500"></i>
              <span className="text-sm font-medium">All Assistants</span>
              <i className="fa-solid fa-chevron-down text-xs text-gray-500"></i>
            </div>

            <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
              <button className="px-3 py-1 rounded-md bg-white text-sm font-medium shadow-sm">
                All
              </button>
              <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
                <i className="fa-solid fa-phone-volume mr-1 text-secondary-500"></i>
                Voice
              </button>
              <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
                <i className="fa-solid fa-comment mr-1 text-primary-500"></i>
                Chat
              </button>
              <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
                <i className="fa-solid fa-envelope mr-1 text-accent-500"></i>
                Email
              </button>
              <button className="px-3 py-1 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
                <i className="fa-brands fa-whatsapp mr-1 text-green-500"></i>
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="dashboard-content" className="p-6 space-y-6">
        <div
          id="funnel-section"
          className="bg-white rounded-xl shadow-glass p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center">
              <i className="fa-solid fa-filter mr-2 text-primary-500"></i>
              CX Pipeline Funnel Analysis
            </h2>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              Conversion Rates
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div id="funnel-chart" className="h-80"></div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Total Interactions
                  </span>
                  <span className="text-2xl font-bold">15,847</span>
                </div>
                <div className="mt-2 text-xs text-green-600">
                  <i className="fa-solid fa-arrow-up mr-1"></i>+12% from last
                  period
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">AI Handled</span>
                  <span className="text-2xl font-bold">12,678</span>
                </div>
                <div className="mt-2 text-xs text-primary-600">
                  80% conversion rate
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Escalated to Human
                  </span>
                  <span className="text-2xl font-bold">3,169</span>
                </div>
                <div className="mt-2 text-xs text-orange-600">
                  20% escalation rate
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Resolved</span>
                  <span className="text-2xl font-bold">14,623</span>
                </div>
                <div className="mt-2 text-xs text-green-600">
                  92.3% resolution rate
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="csat-sentiment-section"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-xl shadow-glass p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <i className="fa-solid fa-chart-line mr-2 text-accent-500"></i>
                CSAT Trends
              </h3>
              <div className="flex space-x-2">
                <button className="text-xs bg-accent-50 text-accent-600 px-2 py-1 rounded-md font-medium">
                  7D
                </button>
                <button className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
                  30D
                </button>
              </div>
            </div>
            <div id="csat-trend-chart" className="h-64"></div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-gray-500">Average Score</div>
                <div className="text-lg font-bold text-accent-600">4.3/5</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Response Rate</div>
                <div className="text-lg font-bold">68%</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Trend</div>
                <div className="text-lg font-bold text-green-600">+2.5%</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-glass p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <i className="fa-solid fa-face-smile mr-2 text-primary-500"></i>
                Sentiment Distribution
              </h3>
              <button className="text-xs text-primary-600 font-medium">
                Filter by Channel
              </button>
            </div>
            <div id="sentiment-chart" className="h-64"></div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Positive</span>
                </div>
                <span className="text-sm font-semibold">68%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm">Neutral</span>
                </div>
                <span className="text-sm font-semibold">24%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Negative</span>
                </div>
                <span className="text-sm font-semibold">8%</span>
              </div>
            </div>
          </div>
        </div>

        <div
          id="intent-confusion-section"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-xl shadow-glass p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <i className="fa-solid fa-brain mr-2 text-secondary-500"></i>
                Intent Heatmap
              </h3>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                Most Frequent
              </span>
            </div>
            <div id="intent-heatmap" className="h-64"></div>
          </div>

          <div className="bg-white rounded-xl shadow-glass p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <i className="fa-solid fa-hand-paper mr-2 text-orange-500"></i>
                Top Handoff Triggers
              </h3>
              <button className="text-xs text-primary-600 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">
                    Complex Billing Issues
                  </div>
                  <div className="text-xs text-gray-500">
                    Account Management
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">342</div>
                  <div className="text-xs text-red-600">+15%</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">Technical Support</div>
                  <div className="text-xs text-gray-500">Product Issues</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">298</div>
                  <div className="text-xs text-orange-600">+8%</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">Refund Requests</div>
                  <div className="text-xs text-gray-500">Payment Issues</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">187</div>
                  <div className="text-xs text-green-600">-3%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="token-cost-section"
          className="bg-white rounded-xl shadow-glass p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center">
              <i className="fa-solid fa-coins mr-2 text-yellow-500"></i>
              Token &amp; Cost Usage Breakdown
            </h2>
            <div className="flex space-x-2">
              <button className="text-xs bg-yellow-50 text-yellow-600 px-2 py-1 rounded-md font-medium">
                Daily
              </button>
              <button className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
                Weekly
              </button>
              <button className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
                Monthly
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div id="token-usage-chart" className="h-64"></div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">
                  Total Tokens Today
                </div>
                <div className="text-2xl font-bold">2.4M</div>
                <div className="text-xs text-green-600 mt-1">
                  <i className="fa-solid fa-arrow-down mr-1"></i>-8% vs
                  yesterday
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Est. Cost</div>
                <div className="text-2xl font-bold text-yellow-600">
                  $142.30
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  GPT-4: $98.20 | UX Pilot: $44.10
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">
                  Avg. Resolution Time
                </div>
                <div className="text-2xl font-bold">2.3min</div>
                <div className="text-xs text-green-600 mt-1">
                  <i className="fa-solid fa-arrow-down mr-1"></i>-12%
                  improvement
                </div>
              </div>
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4 border border-primary-100">
                <div className="text-sm font-medium text-primary-700 mb-1">
                  AI Model Split
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex-1 bg-white rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full w-[68%]"></div>
                  </div>
                  <span className="text-xs font-medium">68% GPT-4</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-white rounded-full h-2">
                    <div className="bg-secondary-500 h-2 rounded-full w-[32%]"></div>
                  </div>
                  <span className="text-xs font-medium">32% UX Pilot</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="customer-journey-section"
          className="bg-white rounded-xl shadow-glass p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center">
              <i className="fa-solid fa-route mr-2 text-purple-500"></i>
              Customer Journey Analytics
            </h2>
            <div className="flex items-center space-x-2">
              <button className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-md font-medium">
                Journey Map
              </button>
              <button className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
                Drop-off Analysis
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">
                Multi-Channel Journey Paths
              </h4>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
                  <div className="flex items-center space-x-2 flex-1">
                    <i className="fa-solid fa-phone-volume text-secondary-500"></i>
                    <i className="fa-solid fa-arrow-right text-gray-400 text-xs"></i>
                    <i className="fa-brands fa-whatsapp text-green-500"></i>
                    <i className="fa-solid fa-arrow-right text-gray-400 text-xs"></i>
                    <i className="fa-solid fa-check-circle text-green-600"></i>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">1,247</div>
                    <div className="text-xs text-gray-500">journeys</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                  <div className="flex items-center space-x-2 flex-1">
                    <i className="fa-solid fa-comment text-primary-500"></i>
                    <i className="fa-solid fa-arrow-right text-gray-400 text-xs"></i>
                    <i className="fa-solid fa-envelope text-accent-500"></i>
                    <i className="fa-solid fa-arrow-right text-gray-400 text-xs"></i>
                    <i className="fa-solid fa-check-circle text-green-600"></i>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">892</div>
                    <div className="text-xs text-gray-500">journeys</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100">
                  <div className="flex items-center space-x-2 flex-1">
                    <i className="fa-solid fa-envelope text-accent-500"></i>
                    <i className="fa-solid fa-arrow-right text-gray-400 text-xs"></i>
                    <i className="fa-solid fa-phone-volume text-secondary-500"></i>
                    <i className="fa-solid fa-arrow-right text-gray-400 text-xs"></i>
                    <i className="fa-solid fa-times-circle text-red-500"></i>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">234</div>
                    <div className="text-xs text-red-500">drop-offs</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">
                Resolution Timeline by Intent
              </h4>
              <div id="journey-timeline-chart" className="h-48"></div>
            </div>
          </div>
        </div>

        <div
          id="agent-feedback-section"
          className="bg-white rounded-xl shadow-glass p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center">
              <i className="fa-solid fa-user-check mr-2 text-indigo-500"></i>
              Agent Feedback Loop
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full flex items-center">
                <i className="fa-solid fa-exclamation-triangle mr-1"></i>
                12 Pending Reviews
              </span>
              <button className="text-xs bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md font-medium transition-colors">
                Export Training Data
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h4 className="text-sm font-medium text-gray-700 mb-4">
                Conversations Requiring Review
              </h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-sm font-medium">
                        Billing Dispute - Complex Case
                      </span>
                      <span className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full">
                        Voice
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    AI couldn't resolve recurring charge dispute, escalated
                    after 3 attempts...
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md hover:bg-green-200 transition-colors">
                        <i className="fa-solid fa-thumbs-up mr-1"></i>Good
                        Response
                      </button>
                      <button className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md hover:bg-yellow-200 transition-colors">
                        <i className="fa-solid fa-wrench mr-1"></i>Needs Fix
                      </button>
                      <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md hover:bg-red-200 transition-colors">
                        <i className="fa-solid fa-times mr-1"></i>Incomplete
                      </button>
                    </div>
                    <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                      View Full
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      <span className="text-sm font-medium">
                        Product Return Process
                      </span>
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                        Chat
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">4 hours ago</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Customer confused about return policy, AI provided partial
                    information...
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md hover:bg-green-200 transition-colors">
                        <i className="fa-solid fa-thumbs-up mr-1"></i>Good
                        Response
                      </button>
                      <button className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md hover:bg-yellow-200 transition-colors">
                        <i className="fa-solid fa-wrench mr-1"></i>Needs Fix
                      </button>
                      <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md hover:bg-red-200 transition-colors">
                        <i className="fa-solid fa-times mr-1"></i>Incomplete
                      </button>
                    </div>
                    <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                      View Full
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">
                AI vs Human Performance
              </h4>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4 border border-primary-200">
                  <div className="text-sm font-medium text-primary-700 mb-2">
                    Resolution Rate
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">AI</span>
                    <span className="text-sm font-bold text-primary-600">
                      87%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Human</span>
                    <span className="text-sm font-bold text-gray-700">94%</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg p-4 border border-accent-200">
                  <div className="text-sm font-medium text-accent-700 mb-2">
                    Avg Response Time
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">AI</span>
                    <span className="text-sm font-bold text-accent-600">
                      12s
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Human</span>
                    <span className="text-sm font-bold text-gray-700">
                      2.3min
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-lg p-4 border border-secondary-200">
                  <div className="text-sm font-medium text-secondary-700 mb-2">
                    CSAT Score
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">AI</span>
                    <span className="text-sm font-bold text-secondary-600">
                      4.2/5
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Human</span>
                    <span className="text-sm font-bold text-gray-700">
                      4.5/5
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Training Progress
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-indigo-500 h-2 rounded-full w-[73%]"></div>
                  </div>
                  <div className="text-xs text-gray-600">
                    73% of flagged cases reviewed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="analytics-summary-section"
          className="bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-glass p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center">
              <i className="fa-solid fa-chart-bar mr-2 text-blue-500"></i>
              Advanced Analytics Summary
            </h2>
            <div className="flex items-center space-x-2">
              <button className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md font-medium transition-colors">
                Schedule Report
              </button>
              <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md font-medium transition-colors">
                Export All Data
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <i className="fa-solid fa-brain text-purple-500 text-xl"></i>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  AI Efficiency
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-600">94.2%</div>
              <div className="text-xs text-gray-500">
                Overall AI Success Rate
              </div>
              <div className="mt-2 text-xs text-green-600">
                <i className="fa-solid fa-arrow-up mr-1"></i>+3.2% vs last month
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <i className="fa-solid fa-clock text-orange-500 text-xl"></i>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                  Speed
                </span>
              </div>
              <div className="text-2xl font-bold text-orange-600">1.8min</div>
              <div className="text-xs text-gray-500">Avg Resolution Time</div>
              <div className="mt-2 text-xs text-green-600">
                <i className="fa-solid fa-arrow-down mr-1"></i>-18% improvement
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <i className="fa-solid fa-dollar-sign text-green-500 text-xl"></i>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Cost Savings
                </span>
              </div>
              <div className="text-2xl font-bold text-green-600">$24.7K</div>
              <div className="text-xs text-gray-500">
                Monthly Cost Reduction
              </div>
              <div className="mt-2 text-xs text-green-600">
                <i className="fa-solid fa-arrow-up mr-1"></i>+12% vs target
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <i className="fa-solid fa-users text-blue-500 text-xl"></i>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  Satisfaction
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-600">4.3/5</div>
              <div className="text-xs text-gray-500">Customer Satisfaction</div>
              <div className="mt-2 text-xs text-green-600">
                <i className="fa-solid fa-arrow-up mr-1"></i>+0.2 points
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <i className="fa-solid fa-lightbulb mr-2 text-yellow-500"></i>
              Key Insights &amp; Recommendations
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">
                      Voice channel performance
                    </span>{" "}
                    is exceeding targets with 96% AI resolution rate
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5"></div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Email response times</span>{" "}
                    need optimization - consider additional training
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Multi-channel journeys</span>{" "}
                    show higher satisfaction rates
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Intent confusion</span> in
                    billing queries suggests model retraining
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Peak hour performance</span>{" "}
                    drops 12% - consider load balancing
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Token optimization</span> has
                    reduced costs by 23% this month
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
