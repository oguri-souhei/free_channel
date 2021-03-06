RSpec.describe ApplicationCable::Connection, type: :channel do
  let(:user) { instance_double(User, id: 1211) }
  let(:env)  { instance_double('env') }

  context 'with a verified user' do
    let(:warden) { instance_double('warden', user: user) }

    before do
      allow_any_instance_of(ApplicationCable::Connection).to receive(:env).and_return(env)
      allow(env).to receive(:[]).with('warden').and_return(warden)
    end

    it 'successfully connects' do
      connect '/cable', headers: { 'X-USER-ID' => 1211 }
      expect(connect.current_user.id).to eq 1211
    end
  end

  context 'without a verified user' do
    let(:warden) { instance_double('warden', user: nil) }

    before do
      allow_any_instance_of(ApplicationCable::Connection).to receive(:env).and_return(env)
      allow(env).to receive(:[]).with('warden').and_return(warden)
    end

    it 'reject connection' do
      expect { connect '/cable' }.to have_rejected_connection
    end
  end
end
