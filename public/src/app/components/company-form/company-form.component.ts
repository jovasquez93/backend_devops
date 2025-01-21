import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit {
  companyForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadCompany(id);
    }
  }

  loadCompany(id: string): void {
    this.companyService.getCompanyById(id).subscribe({
      next: (company) => this.companyForm.patchValue(company),
      error: (err) => console.error(err)
    });
  }

  onSubmit(): void {
    if (this.companyForm.invalid) return;

    const companyData = this.companyForm.value;

    if (this.isEditMode) {
      const id = this.route.snapshot.paramMap.get('id');
      this.companyService.updateCompany(id!, companyData).subscribe({
        next: () => this.router.navigate(['/companies']),
        error: (err) => console.error(err)
      });
    } else {
      this.companyService.addCompany(companyData).subscribe({
        next: () => this.router.navigate(['/companies']),
        error: (err) => console.error(err)
      });
    }
  }
}
