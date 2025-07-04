import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Mail, Github, Twitter } from "lucide-react"

export default function NewsletterSignup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-6">
          {/* Brand Logo */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>

          {/* Headlines */}
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Subscribe to Our Newsletter</CardTitle>
            <CardDescription className="text-gray-600 text-base leading-relaxed">
              Get the latest updates, exclusive content, and insider tips delivered straight to your inbox every week.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social Sign-up Options */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-11 border-gray-200 hover:bg-gray-50 transition-colors bg-transparent"
            >
              <Github className="w-5 h-5 mr-3" />
              Continue with GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full h-11 border-gray-200 hover:bg-gray-50 transition-colors bg-transparent"
            >
              <Twitter className="w-5 h-5 mr-3" />
              Continue with Twitter
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex justify-center">
              <span className="bg-white px-3 text-sm text-gray-500">or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Subscribe Now
            </Button>
          </form>

          {/* Additional Links */}
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors">
              Terms
            </a>
            <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-purple-600 transition-colors">
              Help
            </a>
          </div>

          {/* Trust Indicator Footer */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 flex items-center justify-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
