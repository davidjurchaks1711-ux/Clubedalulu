import { createFileRoute } from '@tanstack/react-router'
import { Calendar, Stethoscope, HeartPulse, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Identidade Visual / Header */}
      <header className="py-8 px-10 md:px-20 flex items-center justify-between bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4 hover:scale-105 transition-transform cursor-pointer">
          <HeartPulse className="w-12 h-12 md:w-16 md:h-16 text-rose-600" />
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">ClinicCare</h1>
        </div>
        <nav className="hidden xl:block">
          <ul className="flex space-x-16 text-2xl font-bold text-slate-600">
            <li><a href="#services" className="hover:text-rose-600 transition-colors">Especialidades</a></li>
            <li><a href="#about" className="hover:text-rose-600 transition-colors">Sobre Nós</a></li>
            <li><a href="#contact" className="hover:text-rose-600 transition-colors">Contato</a></li>
          </ul>
        </nav>
        <button className="hidden lg:flex items-center gap-4 bg-rose-600 hover:bg-rose-700 text-white px-10 py-5 rounded-full font-black text-2xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1">
          <Calendar className="w-8 h-8" />
          Agendar Agora
        </button>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-white pt-36 pb-48 px-10 overflow-hidden">
          <div className="absolute inset-0 bg-rose-50/50 -skew-y-3 transform origin-top-left -z-10" />
          <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-rose-100 text-rose-700 font-bold mb-12 text-2xl shadow-sm">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
              </span>
              Atendimento Humanizado
            </div>
            <h2 className="text-6xl md:text-8xl lg:text-[7rem] font-extrabold text-slate-900 leading-[1.05] mb-12 tracking-tight max-w-6xl">
              Sua saúde e bem-estar <br className="hidden lg:block"/> 
              em <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-500">excelentes mãos</span>.
            </h2>
            <p className="text-3xl md:text-4xl text-slate-600 mb-20 max-w-5xl leading-relaxed font-semibold">
              Descubra uma nova forma de cuidar de si mesma com especialistas dedicados ao atendimento acolhedor, moderno e 100% focado em você.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 w-full justify-center max-w-4xl mx-auto">
              <button className="flex-1 bg-rose-600 text-white text-3xl font-black py-8 px-12 rounded-full shadow-2xl hover:shadow-rose-500/50 hover:bg-rose-700 transform hover:-translate-y-2 transition-all duration-300">
                Agendar Consulta
              </button>
              <button className="flex-1 bg-white text-slate-800 border-4 border-slate-200 text-3xl font-black py-8 px-12 rounded-full shadow-sm hover:border-rose-300 hover:bg-rose-50 transition-all duration-300">
                Nossos Serviços
              </button>
            </div>
          </div>
        </section>

        {/* Serviços / Benefícios */}
        <section id="services" className="py-40 px-10 max-w-[90rem] mx-auto">
          <div className="text-center mb-32">
            <h3 className="text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-10">Como podemos ajudar?</h3>
            <p className="text-3xl md:text-4xl text-slate-500 max-w-4xl mx-auto font-semibold leading-normal">
              Oferecemos um portfólio completo de cuidados focados exclusivamente na saúde feminina.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-20">
            {/* Card 1 */}
            <div className="bg-white p-16 rounded-[3rem] shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-24 h-24 bg-rose-100 rounded-[2rem] flex items-center justify-center text-rose-600 mb-12 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <Stethoscope className="w-12 h-12" />
              </div>
              <h4 className="text-5xl font-extrabold text-slate-900 mb-8">Consultas</h4>
              <p className="text-3xl text-slate-600 leading-relaxed font-medium">
                Atendimento preventivo e de rotina, avaliando seu histórico para uma abordagem totalmente individualizada.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white p-16 rounded-[3rem] shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 p-8 opacity-[0.03]">
                <HeartPulse className="w-80 h-80" />
              </div>
              <div className="w-24 h-24 bg-rose-100 rounded-[2rem] flex items-center justify-center text-rose-600 mb-12 group-hover:scale-110 transition-transform duration-300 shadow-inner relative z-10">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h4 className="text-5xl font-extrabold text-slate-900 mb-8 relative z-10">Diagnósticos</h4>
              <p className="text-3xl text-slate-600 leading-relaxed font-medium relative z-10">
                Exames preventivos e acompanhamentos laboratoriais estruturados para detectar alterações precocemente.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white p-16 rounded-[3rem] shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-24 h-24 bg-rose-100 rounded-[2rem] flex items-center justify-center text-rose-600 mb-12 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <Calendar className="w-12 h-12" />
              </div>
              <h4 className="text-5xl font-extrabold text-slate-900 mb-8">Pré-Natal</h4>
              <p className="text-3xl text-slate-600 leading-relaxed font-medium">
                Cuidado integral, seguro e acolhedor para gestantes, garantindo total tranquilidade da concepção ao parto.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-rose-600 text-white py-40 px-10 mt-20">
          <div className="max-w-7xl mx-auto text-center">
            <h3 className="text-6xl md:text-7xl lg:text-8xl font-black mb-12 leading-[1.1] tracking-tight">Pronta para colocar sua saúde em primeiro lugar?</h3>
            <p className="text-4xl text-rose-100 mb-20 max-w-5xl mx-auto font-semibold leading-relaxed">
              Fale conosco hoje mesmo. Agende de forma rápida e prática pelo WhatsApp ou pela nossa plataforma web.
            </p>
            <button className="bg-white text-rose-600 text-4xl font-black py-10 px-20 rounded-full shadow-2xl hover:bg-slate-50 transform hover:scale-[1.03] transition-all duration-300">
              Marcar Minha Consulta
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-32 px-10">
        <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
          <div>
            <div className="flex items-center gap-5 mb-14">
              <HeartPulse className="w-16 h-16 text-rose-500" />
              <h4 className="text-6xl font-black tracking-tight">ClinicCare</h4>
            </div>
            <p className="text-3xl text-slate-400 font-semibold mb-6">Av. Paulista, 1000 - São Paulo, SP</p>
            <p className="text-3xl text-slate-400 font-semibold mb-12">Segunda a Sexta, 08:00 às 18:00</p>
          </div>
          <div className="lg:text-right flex flex-col justify-center">
            <p className="text-4xl mb-8 font-bold text-slate-300">Fale com nossa equipe</p>
            <a href="mailto:contato@cliniccare.com.br" className="text-4xl md:text-5xl text-rose-500 hover:text-rose-400 font-black mb-8 block transition-colors">
              contato@cliniccare.com.br
            </a>
            <p className="text-4xl md:text-5xl font-black text-white">(11) 99999-9999</p>
          </div>
        </div>
        <div className="max-w-[90rem] mx-auto border-t-2 border-slate-800 mt-28 pt-12 text-center text-slate-500 text-3xl font-medium">
          &copy; {new Date().getFullYear()} ClinicCare. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
