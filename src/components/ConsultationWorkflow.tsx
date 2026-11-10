import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'

type Doctor = { id: string; full_name: string; user_id: string | null; active: boolean }
type PatientOption = { id: string; full_name: string; code: string | null }
type Patient = PatientOption & Record<string, unknown>
type Consultation = {
  id: string
  patient_id: string
  doctor_id: string
  starts_at: string
  ends_at: string
  type: string
  status: string
}
type MedicalRecord = {
  id: string
  patient_id: string
  doctor_id: string | null
  appointment_id: string | null
  record_date: string
  created_at: string
} & Record<string, unknown>
type Tone = 'pink' | 'green' | 'purple' | 'orange' | 'blue'
type CalendarAppointment = Consultation & {
  day: number
  dateKey: string
  time: string
  patient: string
  label: string
  tone: Tone
  icon: 'user' | 'repeat' | 'exam' | 'procedure'
}

export function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function errorMessage(error: unknown) {
  return error && typeof error === 'object' && 'message' in error
    ? String(error.message)
    : 'Não foi possível concluir a operação. Tente novamente.'
}

export function useConsultationAgenda(month: Date) {
  const [userId, setUserId] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState('')
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [doctorsReady, setDoctorsReady] = useState(false)
  const [doctorId, setDoctorId] = useState('')
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [revision, setRevision] = useState(0)
  const [newDate, setNewDate] = useState<string | null>(null)
  const [selected, setSelected] = useState<Consultation | null>(null)
  const refresh = useCallback(() => setRevision(value => value + 1), [])
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1).toISOString()
  const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 1).toISOString()

  useEffect(() => {
    const db = supabase
    if (!db) {
      setAuthLoading(false)
      setAuthError('A conexão Supabase não está disponível para esta página.')
      return
    }
    let active = true
    let authEventReceived = false
    const applySession = (id: string | null) => {
      if (!active) return
      setUserId(id)
      setAuthError('')
      setAuthLoading(false)
    }
    const { data: listener } = db.auth.onAuthStateChange((_event, session) => {
      authEventReceived = true
      applySession(session?.user.id ?? null)
    })
    void db.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active || authEventReceived) return
      if (sessionError) {
        setAuthError(errorMessage(sessionError))
        setAuthLoading(false)
      } else applySession(data.session?.user.id ?? null)
    }).catch(reason => {
      if (active && !authEventReceived) {
        setAuthError(errorMessage(reason))
        setAuthLoading(false)
      }
    })
    return () => { active = false; listener.subscription.unsubscribe() }
  }, [])

  useEffect(() => {
    setAppointments([])
    setSelected(null)
    setNewDate(null)
    setNotice('')
    setDoctors([])
    setDoctorId('')
    setDoctorsReady(false)
    const db = supabase
    if (!db || !userId) return
    let active = true
    void (async () => {
      try {
        const { data, error: queryError } = await db.from('doctors').select('id, full_name, user_id, active').order('full_name')
        if (queryError) throw queryError
        if (!active) return
        const rows = (data ?? []) as Doctor[]
        setDoctors(rows)
        setDoctorId(rows.find(doctor => doctor.user_id === userId)?.id ?? '')
        setDoctorsReady(true)
      } catch (reason) {
        if (active) setError(errorMessage(reason))
      }
    })()
    return () => { active = false }
  }, [userId])

  useEffect(() => {
    const db = supabase
    let active = true
    setAppointments([])
    if (!db || !userId || !doctorsReady) return
    setLoading(true)
    setError('')
    void (async () => {
      try {
        let query = db.from('appointments')
          .select('id, patient_id, doctor_id, starts_at, ends_at, type, status')
          .gte('starts_at', monthStart).lt('starts_at', monthEnd).order('starts_at')
        if (doctorId) query = query.eq('doctor_id', doctorId)
        const { data, error: queryError } = await query
        if (queryError) throw queryError
        const rows = (data ?? []) as Consultation[]
        const ids = [...new Set(rows.map(row => row.patient_id))]
        const names = new Map<string, string>()
        if (ids.length) {
          const { data: patients, error: patientError } = await db.from('patients').select('id, full_name').in('id', ids)
          if (patientError) throw patientError
          for (const patient of patients ?? []) names.set(patient.id, patient.full_name)
        }
        if (!active) return
        setAppointments(rows.map(row => {
          const date = new Date(row.starts_at)
          const tone: Tone = row.type === 'Retorno' ? 'green' : row.type === 'Exame' ? 'purple' : row.type === 'Procedimento' ? 'orange' : row.type === 'Teleconsulta' ? 'blue' : 'pink'
          return {
            ...row, dateKey: localDate(date), day: date.getDate(),
            time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            patient: names.get(row.patient_id) ?? 'Paciente com acesso restrito',
            label: row.type, tone,
            icon: row.type === 'Retorno' ? 'repeat' : row.type === 'Exame' ? 'exam' : row.type === 'Procedimento' ? 'procedure' : 'user',
          }
        }))
      } catch (reason) {
        if (active) setError(errorMessage(reason))
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [userId, doctorsReady, doctorId, monthStart, monthEnd, revision])

  useEffect(() => {
    const db = supabase
    if (!db || !userId) return
    const channel = db.channel(`consultation-agenda-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, refresh)
      .subscribe()
    window.addEventListener('focus', refresh)
    return () => { void db.removeChannel(channel); window.removeEventListener('focus', refresh) }
  }, [userId, refresh])

  return {
    userId, doctors, doctorId, setDoctorId, appointments, loading,
    ready: !!supabase && !!userId && doctorsReady,
    error: authError || error,
    authLoading, notice, newDate, selected, refresh,
    openNew: (date: string) => { setNotice(''); setNewDate(date) },
    closeNew: () => setNewDate(null),
    openAppointment: (id: string) => {
      const appointment = appointments.find(item => item.id === id)
      if (appointment) { setNotice(''); setSelected(appointment) }
    },
    closePatient: () => setSelected(null),
    saved: () => { setNewDate(null); setNotice('Consulta salva na agenda da médica selecionada.'); refresh() },
  }
}

type Agenda = ReturnType<typeof useConsultationAgenda>
const inputClass = 'mt-1 w-full rounded-xl border border-[#eadce4] bg-white px-3 py-2 text-sm text-[#30313f] focus:outline-none focus:ring-2 focus:ring-[#d93275] disabled:opacity-50'
const buttonClass = 'rounded-xl bg-[#d93275] px-4 py-2 text-sm font-bold text-white hover:bg-[#bc2864] disabled:cursor-not-allowed disabled:opacity-50'

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const element = dialog.current
    element?.showModal()
    return () => element?.close()
  }, [])
  return <dialog ref={dialog} aria-label={title} onCancel={event => { event.preventDefault(); onClose() }} className="m-auto max-h-[90vh] w-[min(960px,95vw)] overflow-y-auto rounded-2xl border border-[#eadce4] bg-[#fffafb] p-5 text-[#30313f] shadow-xl backdrop:bg-black/40 sm:p-7">
    <header className="mb-5 flex items-center justify-between gap-4"><h2 className="text-xl font-bold text-[#54213f]">{title}</h2><button type="button" onClick={onClose} className="rounded-lg border border-[#eadce4] bg-white px-3 py-2 text-sm font-semibold">Fechar</button></header>
    {children}
  </dialog>
}

export function AppointmentPanels({ agenda }: { agenda: Agenda }) {
  return <>
    {agenda.authLoading && <p role="status" className="mt-4 rounded-xl bg-white p-4 text-sm">Verificando sessão…</p>}
    {!agenda.authLoading && !agenda.userId && !agenda.error && <p role="alert" className="mt-4 rounded-xl border border-[#eadce4] bg-white p-4 text-sm">Sua sessão não está ativa. Entre pelo acesso habitual da clínica para consultar a agenda.</p>}
    {agenda.error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">{agenda.error}</p>}
    {agenda.notice && <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{agenda.notice}</p>}
    {agenda.loading && <p role="status" className="mt-4 text-sm text-[#66465b]">Carregando consultas…</p>}
    {agenda.ready && <button type="button" onClick={agenda.refresh} disabled={agenda.loading} className="mt-3 rounded-lg border border-[#eadce4] bg-white px-3 py-2 text-sm font-semibold text-[#66465b] disabled:opacity-50">Atualizar agenda</button>}
    {agenda.userId && agenda.newDate && <NewConsultation key={`${agenda.userId}-${agenda.newDate}`} agenda={agenda} date={agenda.newDate} userId={agenda.userId} />}
    {agenda.userId && agenda.selected && <PatientFile key={`${agenda.userId}-${agenda.selected.id}`} appointment={agenda.selected} userId={agenda.userId} doctors={agenda.doctors} onClose={agenda.closePatient} />}
  </>
}

function NewConsultation({ agenda, date, userId }: { agenda: Agenda; date: string; userId: string }) {
  const [patients, setPatients] = useState<PatientOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const active = useRef(true)
  const savingRef = useRef(false)
  useEffect(() => {
    active.current = true
    const db = supabase
    if (!db) return
    void (async () => {
      try {
        const { data, error: queryError } = await db.from('patients').select('id, full_name, code').is('deleted_at', null).order('full_name')
        if (queryError) throw queryError
        if (active.current) setPatients((data ?? []) as PatientOption[])
      } catch (reason) {
        if (active.current) setError(errorMessage(reason))
      } finally {
        if (active.current) setLoading(false)
      }
    })()
    return () => { active.current = false }
  }, [])

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const db = supabase
    if (!db || savingRef.current) return
    const values = new FormData(event.currentTarget)
    const patientId = String(values.get('patient_id') ?? '')
    const doctorId = String(values.get('doctor_id') ?? '')
    const start = new Date(String(values.get('starts_at') ?? ''))
    const duration = Number(values.get('duration'))
    if (!patients.some(patient => patient.id === patientId) || !agenda.doctors.some(doctor => doctor.id === doctorId && doctor.active) || !Number.isFinite(start.getTime()) || !Number.isInteger(duration) || duration < 5 || duration > 480) {
      setError('Selecione uma paciente, uma médica e um horário válido.')
      return
    }
    savingRef.current = true
    setSaving(true)
    setError('')
    try {
      const { data: sessionData, error: sessionError } = await db.auth.getSession()
      if (sessionError) throw sessionError
      if (sessionData.session?.user.id !== userId) throw new Error('A sessão mudou. Reabra o agendamento pelo acesso habitual.')
      const { error: insertError } = await db.from('appointments').insert({
        patient_id: patientId,
        doctor_id: doctorId,
        starts_at: start.toISOString(),
        ends_at: new Date(start.getTime() + duration * 60000).toISOString(),
        type: String(values.get('type')),
        status: 'agendada',
        notes: String(values.get('notes') ?? '').trim() || null,
        created_by: userId,
      })
      if (insertError) throw insertError
      if (active.current) agenda.saved()
    } catch (reason) {
      if (active.current) setError(`Consulta não salva: ${errorMessage(reason)}`)
    } finally {
      savingRef.current = false
      if (active.current) setSaving(false)
    }
  }

  return <Modal title="Nova consulta" onClose={agenda.closeNew}>
    <p className="mb-4 text-sm text-[#66465b]">Selecione os cadastros existentes. Os horários são exibidos no fuso local.</p>
    {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    {loading ? <p role="status" className="py-6 text-center text-sm">Carregando pacientes autorizadas…</p> : <form onSubmit={save} className="space-y-4">
      <fieldset disabled={saving} className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold sm:col-span-2">Paciente<select name="patient_id" required defaultValue="" className={inputClass}><option value="" disabled>Selecione a paciente</option>{patients.map(patient => <option key={patient.id} value={patient.id}>{patient.full_name}{patient.code ? ` · ${patient.code}` : ''}</option>)}</select></label>
        <label className="text-sm font-semibold">Médica responsável<select name="doctor_id" required defaultValue={agenda.doctors.some(doctor => doctor.id === agenda.doctorId && doctor.active) ? agenda.doctorId : ''} className={inputClass}><option value="" disabled>Selecione a médica</option>{agenda.doctors.filter(doctor => doctor.active).map(doctor => <option key={doctor.id} value={doctor.id}>{doctor.full_name}</option>)}</select></label>
        <label className="text-sm font-semibold">Tipo<select name="type" className={inputClass}>{['Consulta', 'Retorno', 'Exame', 'Procedimento', 'Teleconsulta'].map(type => <option key={type}>{type}</option>)}</select></label>
        <label className="text-sm font-semibold">Data e horário<input name="starts_at" type="datetime-local" required defaultValue={`${date}T09:00`} className={inputClass} /></label>
        <label className="text-sm font-semibold">Duração em minutos<input name="duration" type="number" min="5" max="480" step="1" required defaultValue="30" className={inputClass} /></label>
        <label className="text-sm font-semibold sm:col-span-2">Observações<textarea name="notes" rows={3} className={inputClass} /></label>
      </fieldset>
      {!patients.length && <p className="text-sm text-[#66465b]">Nenhuma paciente disponível para este acesso.</p>}
      <button type="submit" disabled={saving || !patients.length || !agenda.doctors.some(doctor => doctor.active)} className={buttonClass}>{saving ? 'Salvando…' : 'Salvar consulta'}</button>
    </form>}
  </Modal>
}

const patientFields = [
  ['code', 'Código'], ['full_name', 'Nome completo'], ['cpf', 'CPF'], ['birth_date', 'Nascimento'], ['gender', 'Gênero'],
  ['phone', 'Telefone'], ['whatsapp', 'WhatsApp'], ['email', 'E-mail'], ['address', 'Endereço'], ['address_number', 'Número'],
  ['address_complement', 'Complemento'], ['neighborhood', 'Bairro'], ['city', 'Cidade'], ['state', 'Estado'], ['zip', 'CEP'],
  ['occupation', 'Profissão'], ['marital_status', 'Estado civil'], ['emergency_contact', 'Contato de emergência'],
  ['blood_type', 'Tipo sanguíneo'], ['allergies', 'Alergias'], ['gestations', 'Gestações'], ['parity', 'Paridade'],
  ['last_menstruation', 'Última menstruação'], ['contraception', 'Contracepção'], ['obstetric_history', 'Histórico obstétrico'],
  ['gynecological_history', 'Histórico ginecológico'], ['origin', 'Origem'], ['status', 'Situação'], ['notes', 'Observações'],
  ['instagram', 'Instagram'], ['facebook', 'Facebook'], ['tiktok', 'TikTok'], ['other_social', 'Outras redes sociais'],
] as const
const recordFields = [
  ['chief_complaint', 'Queixa principal'], ['history', 'História clínica'], ['anamnesis', 'Anamnese'],
  ['gynecological_history', 'Histórico ginecológico'], ['obstetric_history', 'Histórico obstétrico'],
  ['medications', 'Medicamentos'], ['allergies', 'Alergias'], ['exams', 'Exames'], ['diagnosis', 'Diagnóstico'],
  ['observations', 'Observações'], ['conduct', 'Conduta'], ['guidance', 'Orientações'], ['prescription', 'Prescrição'],
] as const

function display(value: unknown) {
  return value === null || value === undefined || value === '' ? 'Não informado' : String(value)
}

function PatientFile({ appointment, userId, doctors, onClose }: { appointment: Consultation; userId: string; doctors: Doctor[]; onClose: () => void }) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [recordError, setRecordError] = useState('')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [revision, setRevision] = useState(0)
  const active = useRef(true)
  const savingRef = useRef(false)
  const doctorName = useMemo(() => new Map(doctors.map(doctor => [doctor.id, doctor.full_name])), [doctors])

  useEffect(() => {
    active.current = true
    return () => { active.current = false }
  }, [])

  useEffect(() => {
    const db = supabase
    if (!db) return
    let current = true
    setLoading(true)
    setError('')
    setRecordError('')
    setPatient(null)
    setRecords([])
    void (async () => {
      try {
        // Revalida a consulta antes de abrir dados clínicos. Nunca busca por nome.
        const { data: linked, error: linkError } = await db.from('appointments')
          .select('id, patient_id, doctor_id').eq('id', appointment.id).single()
        if (linkError) throw linkError
        if (!linked || linked.patient_id !== appointment.patient_id || linked.doctor_id !== appointment.doctor_id) throw new Error('A consulta foi alterada. Atualize a agenda e abra a ficha novamente.')
        const { data, error: patientError } = await db.from('patients').select('*').eq('id', linked.patient_id).single()
        if (patientError) throw patientError
        if (!current) return
        setPatient(data as Patient)
        const { data: history, error: historyError } = await db.from('medical_records').select('*')
          .eq('patient_id', linked.patient_id).order('record_date', { ascending: false }).order('created_at', { ascending: false })
        if (!current) return
        if (historyError) setRecordError(`Não foi possível consultar os atendimentos: ${errorMessage(historyError)}`)
        else setRecords((history ?? []) as MedicalRecord[])
      } catch (reason) {
        if (current) setError(`Ficha indisponível para este acesso ou consulta: ${errorMessage(reason)}`)
      } finally {
        if (current) setLoading(false)
      }
    })()
    return () => { current = false }
  }, [appointment.id, appointment.patient_id, appointment.doctor_id, revision])

  async function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const db = supabase
    if (!db || !patient || savingRef.current) return
    const form = event.currentTarget
    const values = new FormData(form)
    const fields: Record<string, string | number | null> = {}
    for (const [key] of recordFields) fields[key] = String(values.get(key) ?? '').trim() || null
    if (!recordFields.some(([key]) => fields[key])) {
      setRecordError('Preencha pelo menos um campo do atendimento.')
      return
    }
    const returnDays = String(values.get('return_days') ?? '')
    if (returnDays && (!Number.isInteger(Number(returnDays)) || Number(returnDays) < 0)) {
      setRecordError('Informe um prazo de retorno válido.')
      return
    }
    fields.return_days = returnDays ? Number(returnDays) : null
    savingRef.current = true
    setSaving(true)
    setRecordError('')
    setNotice('')
    try {
      const { data: sessionData, error: sessionError } = await db.auth.getSession()
      if (sessionError) throw sessionError
      if (sessionData.session?.user.id !== userId) throw new Error('A sessão mudou. Reabra a ficha pelo acesso habitual.')
      const { data: linked, error: linkError } = await db.from('appointments').select('id, patient_id, doctor_id').eq('id', appointment.id).single()
      if (linkError) throw linkError
      if (!linked || linked.patient_id !== appointment.patient_id || linked.doctor_id !== appointment.doctor_id) throw new Error('A consulta foi alterada. Atualize a agenda antes de registrar o atendimento.')
      const { error: insertError } = await db.from('medical_records').insert({
        ...fields,
        patient_id: linked.patient_id,
        doctor_id: linked.doctor_id,
        appointment_id: linked.id,
        record_date: String(values.get('record_date')),
        created_by: userId,
        updated_by: userId,
      })
      if (insertError) throw insertError
      if (active.current) {
        form.reset()
        setNotice('Atendimento registrado e vinculado à consulta selecionada.')
        setRevision(value => value + 1)
      }
    } catch (reason) {
      if (active.current) setRecordError(`Atendimento não salvo: ${errorMessage(reason)}`)
    } finally {
      savingRef.current = false
      if (active.current) setSaving(false)
    }
  }

  return <Modal title="Ficha da paciente" onClose={onClose}>
    {loading && <p role="status" className="py-6 text-center text-sm">Carregando ficha e atendimentos autorizados…</p>}
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}
    {!loading && patient && <div className="space-y-6">
      <section className="rounded-xl border border-[#eadce4] bg-white p-4">
        <div className="mb-4 flex items-center gap-4">{typeof patient.photo_url === 'string' && patient.photo_url && <img src={patient.photo_url} alt="Foto da paciente" className="h-16 w-16 rounded-full object-cover" />}<div><h3 className="text-xl font-bold text-[#54213f]">{patient.full_name}</h3><p className="mt-1 text-sm text-[#66465b]">Consulta: {new Date(appointment.starts_at).toLocaleString('pt-BR')} · {doctorName.get(appointment.doctor_id) ?? 'Médica com acesso restrito'}</p><p className="mt-1 text-sm text-[#66465b]">{appointment.type} · {appointment.status}</p></div></div>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{patientFields.map(([key, label]) => <div key={key} className="min-w-0"><dt className="text-xs font-semibold text-[#8d6079]">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm">{display(patient[key])}</dd></div>)}<div><dt className="text-xs font-semibold text-[#8d6079]">Médica responsável pelo cadastro</dt><dd className="mt-1 text-sm">{patient.responsible_doctor_id ? doctorName.get(String(patient.responsible_doctor_id)) ?? 'Acesso restrito' : 'Não informada'}</dd></div></dl>
      </section>
      <section aria-labelledby="attendance-title" className="rounded-xl border border-[#eadce4] bg-white p-4">
        <h3 id="attendance-title" className="text-xl font-bold text-[#54213f]">Atendimento</h3>
        <p className="mt-2 text-sm text-[#66465b]">O registro será vinculado à paciente, à médica e à consulta acima. Somente dados autorizados pelo seu acesso são consultados e gravados.</p>
        {notice && <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
        {recordError && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{recordError}</p>}
        <form onSubmit={saveRecord} className="mt-5 space-y-4">
          <fieldset disabled={saving} className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-3 text-base font-bold">Registrar atendimento desta consulta</legend>
            <label className="text-sm font-semibold">Data do atendimento<input name="record_date" type="date" required defaultValue={localDate(new Date())} className={inputClass} /></label>
            <label className="text-sm font-semibold">Retorno em dias<input name="return_days" type="number" min="0" step="1" className={inputClass} /></label>
            {recordFields.map(([key, label]) => <label key={key} className="text-sm font-semibold">{label}<textarea name={key} rows={3} className={inputClass} /></label>)}
          </fieldset>
          <button type="submit" disabled={saving} className={buttonClass}>{saving ? 'Salvando…' : 'Salvar atendimento'}</button>
        </form>
        <div className="mt-8 border-t border-[#eadce4] pt-5"><h4 className="text-lg font-bold text-[#54213f]">Histórico de atendimentos</h4><p className="mt-1 text-sm text-[#66465b]">Registros desta paciente disponíveis para seu acesso.</p>
          {!recordError && records.length === 0 && <p className="mt-4 rounded-xl bg-[#fffafb] p-4 text-sm">Nenhum atendimento disponível.</p>}
          <div className="mt-4 space-y-3">{records.map(record => <article key={record.id} className="rounded-xl border border-[#eadce4] bg-[#fffafb] p-4">
            <h5 className="font-bold text-[#54213f]">{record.record_date.split('-').reverse().join('/')} · {record.doctor_id ? doctorName.get(record.doctor_id) ?? 'Médica com acesso restrito' : 'Médica não informada'}</h5>
            <p className="mt-1 text-xs font-semibold text-[#8d6079]">{record.appointment_id === appointment.id ? 'Consulta selecionada' : record.appointment_id ? 'Outra consulta da paciente' : 'Sem consulta vinculada'}</p>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">{recordFields.filter(([key]) => record[key] !== null && record[key] !== undefined && record[key] !== '').map(([key, label]) => <div key={key}><dt className="text-xs font-bold text-[#8d6079]">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm">{display(record[key])}</dd></div>)}{record.return_days !== null && record.return_days !== undefined && <div><dt className="text-xs font-bold text-[#8d6079]">Retorno em dias</dt><dd className="mt-1 text-sm">{display(record.return_days)}</dd></div>}</dl>
          </article>)}</div>
        </div>
      </section>
    </div>}
  </Modal>
}
