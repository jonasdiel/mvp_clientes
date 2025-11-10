import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClientForm } from './ClientForm';
import { Client } from '@/shared/types/client.types';

describe('ClientForm', () => {
  const mockOnSubmit = vi.fn();

  const mockClient: Client = {
    id: '123',
    name: 'João Silva',
    salary: 500000, // R$ 5.000,00
    companyValue: 10000000, // R$ 100.000,00
    viewCount: 5,
    createdAt: '2025-01-09T10:00:00Z',
    updatedAt: '2025-01-09T10:00:00Z',
    deletedAt: null,
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render form fields', () => {
    render(<ClientForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/salário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/valor da empresa/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
  });

  it('should populate form with default values', () => {
    render(<ClientForm defaultValues={mockClient} onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/nome/i) as HTMLInputElement;
    const salaryInput = screen.getByLabelText(/salário/i) as HTMLInputElement;
    const companyValueInput = screen.getByLabelText(
      /valor da empresa/i
    ) as HTMLInputElement;

    expect(nameInput.value).toBe('João Silva');
    expect(salaryInput.value).toBe('5000'); // Convertido de centavos
    expect(companyValueInput.value).toBe('100000'); // Convertido de centavos
  });

  it('should show validation errors for empty required fields', async () => {
    render(<ClientForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/o nome é obrigatório/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    render(<ClientForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/nome/i);
    const salaryInput = screen.getByLabelText(/salário/i);
    const companyValueInput = screen.getByLabelText(/valor da empresa/i);

    fireEvent.change(nameInput, { target: { value: 'Maria Santos' } });
    fireEvent.change(salaryInput, { target: { value: '6000' } });
    fireEvent.change(companyValueInput, { target: { value: '200000' } });

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Maria Santos',
        salary: 600000, // Convertido para centavos
        companyValue: 20000000, // Convertido para centavos
      });
    });
  });

  it('should disable fields when loading', () => {
    render(<ClientForm onSubmit={mockOnSubmit} isLoading={true} />);

    const nameInput = screen.getByLabelText(/nome/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button') as HTMLButtonElement;

    expect(nameInput.disabled).toBe(true);
    expect(submitButton.disabled).toBe(true);
    expect(submitButton.textContent).toBe('Salvando...');
  });

  it('should show custom submit label', () => {
    render(
      <ClientForm onSubmit={mockOnSubmit} submitLabel="Atualizar Cliente" />
    );

    expect(
      screen.getByRole('button', { name: /atualizar cliente/i })
    ).toBeInTheDocument();
  });

  it('should validate negative salary', async () => {
    render(<ClientForm onSubmit={mockOnSubmit} />);

    // Fill in required name field
    const nameInput = screen.getByLabelText(/nome/i);
    fireEvent.change(nameInput, { target: { value: 'Test Client' } });

    const salaryInput = screen.getByLabelText(/salário/i);
    const companyValueInput = screen.getByLabelText(/valor da empresa/i);

    // Set a negative salary - need to directly change the value
    fireEvent.change(salaryInput, { target: { value: '-100' } });
    // Set a valid company value
    fireEvent.change(companyValueInput, { target: { value: '1000' } });

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Check that the error message appears
      expect(
        screen.getByText(/o salário deve ser maior ou igual a zero/i)
      ).toBeInTheDocument();
      // And that the submit was not called
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('should validate negative company value', async () => {
    render(<ClientForm onSubmit={mockOnSubmit} />);

    // Fill in required name field
    const nameInput = screen.getByLabelText(/nome/i);
    fireEvent.change(nameInput, { target: { value: 'Test Client' } });

    const salaryInput = screen.getByLabelText(/salário/i);
    const companyValueInput = screen.getByLabelText(/valor da empresa/i);

    // Set a valid salary
    fireEvent.change(salaryInput, { target: { value: '1000' } });
    // Set a negative company value - need to directly change the value
    fireEvent.change(companyValueInput, { target: { value: '-500' } });

    const submitButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Check that the error message appears
      expect(
        screen.getByText(/o valor da empresa deve ser maior ou igual a zero/i)
      ).toBeInTheDocument();
      // And that the submit was not called
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});
