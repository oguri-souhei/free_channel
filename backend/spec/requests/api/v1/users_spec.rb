require 'rails_helper'

RSpec.describe 'Api::V1::Users', type: :request do
  let(:tom) { create(:tom) }

  describe 'GET /api/v1/login_user' do
    context 'when user is logged in' do
      before do
        sign_in tom
        get api_v1_login_user_path
      end

      it 'responds :ok' do
        expect(response).to have_http_status :ok
      end

      it 'render json' do
        expect(response).to have_content_type :json
      end

      it 'render current_user data' do
        data = JSON.parse(response.body)['data']
        aggregate_failures do
          expect(data['id']).to eq tom.id
          expect(data['name']).to eq tom.name
          expect(data['email']).to eq tom.email
          expect(data['created_at']).to_not be_blank
          expect(data['updated_at']).to_not be_blank
          # パスワードなどが含まれていないか？
          expect(data['password']).to be_blank
          expect(data['password_confirmation']).to be_blank
          expect(data['encrypted_password']).to be_blank
        end
      end
    end

    context 'when user is not logged in' do
      before do
        get api_v1_login_user_path
      end

      it 'responds :ok' do
        expect(response).to have_http_status :ok
      end

      it 'render json' do
        expect(response).to have_content_type :json
      end

      it 'render data nil' do
        data = JSON.parse(response.body)['data']
        expect(data).to be_nil
      end
    end
  end
end
