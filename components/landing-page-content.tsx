


"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  BarChart3, 
  Users, 
  FileText, 
  Link as LinkIcon, 
  Globe, 
  Mail, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Shield,
  Zap
} from "lucide-react"
import Link from "next/link"

export default function LandingPageContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-crm-background via-crm-surface to-crm-background">
      {/* Header */}
      <header className="border-b border-crm-border bg-crm-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-crm-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <span className="text-2xl font-bold text-crm-text">ZON</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#services" className="text-crm-text-secondary hover:text-crm-text transition-colors">Services</a>
            <a href="#features" className="text-crm-text-secondary hover:text-crm-text transition-colors">Features</a>
            <a href="#pricing" className="text-crm-text-secondary hover:text-crm-text transition-colors">Pricing</a>
            <a href="#contact" className="text-crm-text-secondary hover:text-crm-text transition-colors">Contact</a>
          </nav>
          <Link href="/login">
            <Button className="bg-crm-primary hover:bg-crm-primary/90 text-white">
              Login to CRM
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-crm-primary/20 text-crm-primary border-crm-primary/30">
            <Zap className="w-3 h-3 mr-1" />
            Professional Digital Marketing CRM
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-crm-text mb-6 leading-tight">
            Scale Your Digital
            <span className="text-crm-primary block">Marketing Agency</span>
          </h1>
          <p className="text-xl text-crm-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
            ZON is the comprehensive CRM solution that empowers digital marketing agencies to manage SEO campaigns, 
            content marketing, social media, and client projects with unprecedented efficiency and insight.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-crm-primary hover:bg-crm-primary/90 text-white px-8 py-4 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-crm-border text-crm-text hover:bg-crm-surface px-8 py-4 text-lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-crm-surface/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-crm-text mb-4">Our Digital Marketing Services</h2>
            <p className="text-xl text-crm-text-secondary max-w-2xl mx-auto">
              Comprehensive solutions to grow your online presence and drive results
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-crm-card border-crm-border hover:border-crm-primary/50 transition-all duration-300">
              <CardHeader>
                <Search className="h-12 w-12 text-crm-primary mb-4" />
                <CardTitle className="text-crm-text">SEO Optimization</CardTitle>
                <CardDescription className="text-crm-text-secondary">
                  Complete SEO audits, keyword research, on-page and off-page optimization to boost your search rankings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-crm-text-secondary">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Technical SEO Audits</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Keyword Research & Strategy</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Link Building Campaigns</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-crm-card border-crm-border hover:border-crm-primary/50 transition-all duration-300">
              <CardHeader>
                <FileText className="h-12 w-12 text-crm-primary mb-4" />
                <CardTitle className="text-crm-text">Content Marketing</CardTitle>
                <CardDescription className="text-crm-text-secondary">
                  Strategic content creation, blog management, and content optimization for maximum engagement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-crm-text-secondary">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Content Strategy & Planning</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Blog Writing & Management</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Content Performance Analytics</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-crm-card border-crm-border hover:border-crm-primary/50 transition-all duration-300">
              <CardHeader>
                <Users className="h-12 w-12 text-crm-primary mb-4" />
                <CardTitle className="text-crm-text">Social Media Management</CardTitle>
                <CardDescription className="text-crm-text-secondary">
                  Complete social media strategy, content creation, scheduling, and community management.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-crm-text-secondary">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Social Media Strategy</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Content Creation & Scheduling</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Community Management</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-crm-card border-crm-border hover:border-crm-primary/50 transition-all duration-300">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-crm-primary mb-4" />
                <CardTitle className="text-crm-text">Paid Advertising</CardTitle>
                <CardDescription className="text-crm-text-secondary">
                  Google Ads, Facebook Ads, and LinkedIn campaigns optimized for maximum ROI and conversions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-crm-text-secondary">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Google Ads Management</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Social Media Advertising</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Campaign Optimization</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-crm-card border-crm-border hover:border-crm-primary/50 transition-all duration-300">
              <CardHeader>
                <Mail className="h-12 w-12 text-crm-primary mb-4" />
                <CardTitle className="text-crm-text">Email Marketing</CardTitle>
                <CardDescription className="text-crm-text-secondary">
                  Automated email campaigns, newsletter management, and lead nurturing sequences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-crm-text-secondary">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Email Campaign Design</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Marketing Automation</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Performance Tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-crm-card border-crm-border hover:border-crm-primary/50 transition-all duration-300">
              <CardHeader>
                <Globe className="h-12 w-12 text-crm-primary mb-4" />
                <CardTitle className="text-crm-text">Web Development</CardTitle>
                <CardDescription className="text-crm-text-secondary">
                  Custom website development, optimization, and maintenance for peak performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-crm-text-secondary">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Website Development</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Performance Optimization</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Ongoing Maintenance</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CRM Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-crm-text mb-4">Powerful CRM Features</h2>
            <p className="text-xl text-crm-text-secondary max-w-2xl mx-auto">
              Everything you need to manage your digital marketing agency efficiently
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-crm-card border-crm-border">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-crm-primary mb-2" />
                <CardTitle className="text-crm-text">Real-time Analytics</CardTitle>
                <CardDescription className="text-crm-text-secondary">
                  Track performance across all campaigns with comprehensive dashboards and reporting.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-crm-card border-crm-border">
              <CardHeader>
                <Users className="h-8 w-8 text-crm-primary mb-2" />
                <CardTitle className="text-crm-text">Client Management</CardTitle>
                <CardDescription className="text-crm-text-secondary">
                  Organize clients, projects, and communications in one centralized platform.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-crm-card border-crm-border">
              <CardHeader>
                <Shield className="h-8 w-8 text-crm-primary mb-2" />
                <CardTitle className="text-crm-text">Role-based Access</CardTitle>
                <CardDescription className="text-crm-text-secondary">
                  Granular permissions and role management for team members and clients.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-crm-surface/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-crm-primary mb-2">500+</div>
              <div className="text-crm-text-secondary">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-crm-primary mb-2">150+</div>
              <div className="text-crm-text-secondary">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-crm-primary mb-2">98%</div>
              <div className="text-crm-text-secondary">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-crm-primary mb-2">24/7</div>
              <div className="text-crm-text-secondary">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-crm-text mb-4">Ready to Transform Your Agency?</h2>
          <p className="text-xl text-crm-text-secondary mb-8 max-w-2xl mx-auto">
            Join hundreds of successful agencies using ZON CRM to streamline operations and drive growth.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-crm-primary hover:bg-crm-primary/90 text-white px-8 py-4 text-lg">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-crm-border bg-crm-surface py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-crm-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Z</span>
                </div>
                <span className="text-2xl font-bold text-crm-text">ZON</span>
              </div>
              <p className="text-crm-text-secondary">
                Professional digital marketing CRM solution for growing agencies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-crm-text mb-4">Services</h4>
              <ul className="space-y-2 text-crm-text-secondary">
                <li>SEO Optimization</li>
                <li>Content Marketing</li>
                <li>Social Media</li>
                <li>Paid Advertising</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-crm-text mb-4">Company</h4>
              <ul className="space-y-2 text-crm-text-secondary">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-crm-text mb-4">Contact</h4>
              <ul className="space-y-2 text-crm-text-secondary">
                <li>www.zon.ae</li>
                <li>info@zon.ae</li>
                <li>+971 XX XXX XXXX</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-crm-border mt-8 pt-8 text-center text-crm-text-secondary">
            <p>&copy; 2024 ZON. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}